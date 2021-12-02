# 副作用函数

在之前的 响应式原理里, 收集依赖和派发更新都有一个概念 `effact` 副作用函数. (为什么交副作用: 函数式编程, 函数只做一件事, 其中其他的的事就是副作用)

看一个例子:

```js
import { reactive } from 'vue';
const counter = reactive({
  num: 0,
});
function logCount() {
  console.log(counter.num);
}
function count() {
  counter.num++;
}
logCount();
count();
```

我们需要在每次执行 `count`函数的时候, 能自动执行 `logCounr`. 目前是没法做到的, 因为`console.log(counter.num)`并不知道他是在哪执行. 其实很简单, 记住 `logCount` 整个函数, 下次调用. 还记得依赖收集中, 说到**收集依赖就是收集当前激活的副作用函数`activeEffect`**.

没错,这时的 `activeEffect` 就是 `logCount`

```js
function wrapper(fn) {
  const wrapped = function (...args) {
    activeEffect = fn;
    fn(...args);
  };
  return wrapped;
}
const wrappedLog = wrapper(logCount);
wrappedLog();
// 执行 wrappedLog 后，再去修改 counter.num，然后派发更新, 就会自动执行 logCount 函数
```

[看一下, 在 Vue3 中的实现: ](https://github.com/vuejs/vue-next/blob/61720231b48dc57eeda8930eae11b5a03d9210a3/packages/reactivity/src/effect.ts#L53)

```js
// The number of effects currently being tracked recursively.
// 表示递归嵌套执行 effect 函数的深度
let effectTrackDepth = 0
// 用于标识依赖收集的状态
export let trackOpBit = 1
/**
 * The bitwise track markers support at most 30 levels of recursion.
 * This value is chosen to enable modern JS engines to use a SMI on all platforms.
 * When recursion depth is greater, fall back to using a full cleanup.
 */
// 表示最大标记的位数。 30 以前是每次都 cleanupEffect, 这样有性能损耗,小优化就是通过整个参数来减少 clean次数
// 每次副作用函数执行，都需要先执行 cleanup 清除依赖，然后在副作用函数执行的过程中重新收集依赖，这个过程牵涉到大量对 Set 集合的添加和删除操作。在许多场景下，依赖关系是很少改变的
const maxMarkerBits = 30
// 全局 effect 栈
const effectStack = [];
// 当前激活的 effect
let activeEffect;
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  if ((fn as ReactiveEffectRunner).effect) {
    fn = (fn as ReactiveEffectRunner).effect.fn
  }

  const _effect = new ReactiveEffect(fn)
  if (options) {
    extend(_effect, options)
    if (options.scope) recordEffectScope(_effect, options.scope)
  }
  if (!options || !options.lazy) {
    _effect.run()
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}
export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []
  // can be attached after creation
  computed?: boolean
  allowRecurse?: boolean
  onStop?: () => void
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void
  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: EffectScope | null
  ) {
    recordEffectScope(this, scope)
  }
  run() {
    // 非激活状态，则判断如果非调度执行，则直接执行原始函数。
    if (!this.active) {
      return this.fn()
    }
    if (!effectStack.includes(this)) {
      try {
        // 压栈
        effectStack.push((activeEffect = this))
        // // 开启全局 shouldTrack，允许依赖收集
        enableTracking()

        trackOpBit = 1 << ++effectTrackDepth
        // 超过 maxMarkerBits 则 trackOpBit 的计算会超过最大整形的位数，降级为 cleanupEffect
        if (effectTrackDepth <= maxMarkerBits) {
          // 给依赖打标记
          initDepMarkers(this)
        } else {
          // 清空 effect 引用的依赖
          cleanupEffect(this)
        }
        // 执行原始函数
        return this.fn()
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          // 完成依赖标记
          /*finalizeDepMarkers 主要做的事情就是找到那些曾经被收集过但是新的一轮依赖收集没有被收集的依赖，从 deps 中移除。这其实就是解决前面举的需要 cleanup 的场景：在新的组件渲染过程中没有访问到的响应式对象，那么它的变化不应该触发组件的重新渲染。
          */
          finalizeDepMarkers(this)
        }
        // 恢复到上一级
        trackOpBit = 1 << --effectTrackDepth
        // 恢复 shouldTrack 开启之前的状态
        resetTracking()
        // 出栈
        effectStack.pop()
        const n = effectStack.length
        // 指向栈最后一个 effect
        activeEffect = n > 0 ? effectStack[n - 1] : undefined
      }
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

```

整个`effect`函数做的事情, 其实就和前面分析的差不多. **把全局的 activeEffect 指向它 ， 然后执行被包装的原始函数 fn 即可 。**, 实际上复杂一些, 多了很多功能上的参数和判断.

## 栈结构

值得注意的一点: 之前我们提到，只要设置 `activeEffect = effect` 即可，那么这里为什么要设计一个栈的结构呢？

```js
import { reactive } from 'vue';
import { effect } from '@vue/reactivity';
const counter = reactive({
  num: 0,
  num2: 0,
});
function logCount() {
  effect(logCount2);
  console.log('num:', counter.num);
}
function count() {
  counter.num++;
}
function logCount2() {
  console.log('num2:', counter.num2);
}
effect(logCount);
count();
/**
 我们每次执行 effect 函数时，如果仅仅把 reactiveEffect 函数赋值给 activeEffect，那么针对这种嵌套场景，执行完 effect(logCount2) 后，activeEffect 还是 effect(logCount2) 返回的 reactiveEffect 函数，这样后续访问 counter.num 的时候，依赖收集对应的 activeEffect 就不对了，此时我们外部执行 count 函数修改 counter.num 后执行的便不是 logCount 函数，而是 logCount2 函数
*/
```

**其实这里是考虑到嵌套`effect`的场景**. 因为函数是执行本来就是一种出栈入栈的操作(执行上席文)

因此我们也可以设计一个 `effectStack`，这样每次进入 `reactiveEffect` 函数就先把它入栈，然后 `activeEffect` 指向这个 `reactiveEffect` 函数，接着在 fn 执行完毕后出栈，再把 `activeEffect` 指向 `effectStack` 最后一个元素，也就是外层 `effect` 函数对应的 `reactiveEffect`。

## cleanupEffect

首先为什么有 `cleanupEffect`. 看一下整个例子:

原因就是: **这种带有分支处理的情况。因为监听函数中，可能会由于 if 等条件判断语句导致的依赖数据不同。所以每次执行函数时，都要重新更新一次依赖**

如果没有 `cleanupEffect`, 当 if 的值改变,之前的依赖还存在. 改变相应的值, 页面依然会重新渲染.

```Vue
<template>
  <div v-if="state.showMsg">
    {{ state.msg }}
  </div>
  <div v-else>
    {{ Math.random() }}
  </div>
  <button @click="toggle">Toggle Msg</button>
  <button @click="switchView">Switch View</button>
</template>
<script>
import { reactive } from 'vue';
export default {
  setup() {
    const state = reactive({
      msg: 'Hello World',
      showMsg: true,
    });
    function toggle() {
      state.msg = state.msg === 'Hello World' ? 'Hello Vue' : 'Hello World';
    }
    function switchView() {
      state.showMsg = !state.showMsg;
    }
    return {
      toggle,
      switchView,
      state,
    };
  },
};
</script>
```

[优化:这个 issues](https://github.com/vuejs/vue-next/pull/3995)

在之前的逻辑中, 每次副作用函数执行，都需要先执行 cleanup 清除依赖，然后在副作用函数执行的过程中重新收集依赖，这个过程牵涉到大量对 Set 集合的添加和删除操作。在许多场景下，依赖关系是很少改变的.

为了减少集合的添加删除操作，我们需要标识每个依赖集合的状态，比如它是不是新收集的，还是已经被收集过的。

当 run 函数执行的时候，我们注意到 cleanup 函数不再默认执行，在封装的函数 fn 执行前，首先执行 `trackOpBit = 1 << ++effectTrackDepth` 记录 `trackOpBit`，然后对比递归深度是否超过了 `maxMarkerBits`，如果超过（通常情况下不会）则仍然执行老的 cleanup 逻辑，如果没超过则执行 `initDepMarkers` 给依赖打标记

`finalizeDepMarkers` 主要做的事情就是找到那些曾经被收集过但是新的一轮依赖收集没有被收集的依赖，从 deps 中移除。这其实就是解决前面举的需要 cleanup 的场景：**在新的组件渲染过程中没有访问到的响应式对象，那么它的变化不应该触发组件的重新渲染。**

```js
const finalizeDepMarkers = effect => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      // 曾经被收集过但不是新的依赖，需要删除
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      // 清空状态
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
```

# ref
```js
function ref(value) {
  return createRef(value)
}

const convert = (val) => isObject(val) ? reactive(val) : val

function createRef(rawValue, shallow = false) {
  if (isRef(rawValue)) {
    // 如果传入的就是一个 ref，那么返回自身即可，处理嵌套 ref 的情况。
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

class RefImpl {
  constructor(value, _shallow = false) {
    this._shallow = _shallow
    this.dep = undefined
    this.__v_isRef = true
    this._rawValue = _shallow ? value : toRaw(value)
    this._value = _shallow ? value : convert(value)
  }
  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newVal) {
    newVal = this._shallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this._shallow ? newVal : convert(newVal)
      triggerRefValue(this, newVal)
    }
  }
}
// 直接把 ref 的相关依赖保存到 dep 属性中，而在 track 函数的实现中，会把依赖保留到全局的 targetMap 中：
function trackRefValue(ref) {
  if (isTracking()) {
    ref = toRaw(ref)
    if (!ref.dep) {
      ref.dep = createDep()
    }
    if ((process.env.NODE_ENV !== 'production')) {
      trackEffects(ref.dep, {
        target: ref,
        type: "get" /* GET */,
        key: 'value'
      })
    }
    else {
      trackEffects(ref.dep)
    }
  }
}
function triggerRefValue(ref, newVal) {
  ref = toRaw(ref)
  if (ref.dep) {
    if ((process.env.NODE_ENV !== 'production')) {
      triggerEffects(ref.dep, {
        target: ref,
        type: "set" /* SET */,
        key: 'value',
        newValue: newVal
      })
    }
    else {
      triggerEffects(ref.dep)
    }
  }
}

function triggerEffects(dep, debuggerEventExtraInfo) {
  for (const effect of isArray(dep) ? dep : [...dep]) {
    if (effect !== activeEffect || effect.allowRecurse) {
      if ((process.env.NODE_ENV !== 'production') && effect.onTrigger) {
        effect.onTrigger(extend({ effect }, debuggerEventExtraInfo))
      }
      if (effect.scheduler) {
        effect.scheduler()
      }
      else {
        effect.run()
      }
    }
  }
}

```