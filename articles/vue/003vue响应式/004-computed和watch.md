# 计算属性 VS 侦听属性

从根本上来说，computed 是 Watcher 的一种，又称为 `computed-watcher`。其实就是在创建的时候，传入了 `{ computed: true }`这个参数。下面具体看下

## computed
特点：
- 不会一开始就求值，render 到了在求值
- 依赖个数为 0，惰性，下次再访问这个计算属性的时候才会重新求值
- 不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化才会触发渲染

初始化 computed

```js
// 代码位置 src/core/instance/state.js
// 声明 computed-watcher 参数
const computedWatcherOptions = { computed: true };
function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  const isSSR = isServerRendering();
  // 对 computed 对象做遍历，拿到计算属性的每一个 userDef，然后尝试获取这个 userDef 对应的 getter 函数
  for (const key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm);
    }
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
    }

    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm);
      }
    }
  }
}
// 利用 Object.defineProperty 给计算属性对应的 key 值添加 getter 和 setter，setter 通常是计算属性是一个对象，并且拥有 set 方法的时候才有，否则是一个空函数
export function defineComputed(target: any, key: string, userDef: Object | Function) {
  const shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get ? (shouldCache && userDef.cache !== false ? createComputedGetter(key) : userDef.get) : noop;
    sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
  }
  if (process.env.NODE_ENV !== 'production' && sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(`Computed property "${key}" was assigned to but it has no setter.`, this);
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
// createComputedGetter 返回一个函数 computedGetter，它就是计算属性对应的 getter
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      watcher.depend();
      return watcher.evaluate();
    }
  };
}
```

上面是计算属性的初始化过程, 可以看到, `new Watcher()` 的时候传入了,特殊的参数. 在执行构造函数的过程中:

```js
//一下代码是片段, 答意
// ...
  if (this.computed) {
    this.value = undefined
    this.dep = new Dep()
  } else {
    this.value = this.get()
  }

/**
* Depend on this watcher. Only for computed property watchers.
*/
depend () {
  if (this.dep && Dep.target) {
    this.dep.depend()
  }
}

/**
  * Evaluate and return the value of the watcher.
  * This only gets called for computed property watchers.
  */
evaluate () {
  if (this.dirty) {
    this.value = this.get() //value = this.getter.call(vm, vm)，这实际上就是执行了计算属性定义的 getter 函数
    this.dirty = false
  }
  return this.value
}
```

- computed watcher 会并不会立刻求值，同时持有一个 dep 实例
- render 函数执行访问到 当前计算属性 的时候，就触发了计算属性的 getter，它会拿到计算属性对应的 watcher，然后执行 watcher.depend()
- Dep.target 是渲染 watcher，所以 this.dep.depend() 相当于渲染 watcher 订阅了这个 computed watcher 的变化。
- 执行 watcher.evaluate() 去求值

再看一下, 计算属性依赖的数据变化后的逻辑

```js
/* istanbul ignore else */
if (this.computed) {
  // 计算属性观察程序有两种模式：惰性模式和激活模式。
  //默认情况下，它初始化为lazy，只有在
  //它依赖于至少一个订阅者，这通常是
  //另一个计算属性或组件的渲染函数。
  if (this.dep.subs.length === 0) {
    //在惰性模式下，我们不希望在必要时执行计算，
    //因此，我们只是将观察者标记为肮脏。实际计算为：//当computed属性//访问。
    this.dirty = true;
  } else {
  //在激活模式下，我们希望主动执行计算
  //但只有在值确实发生变化时才通知我们的订户。
    this.getAndInvoke(() => {
      this.dep.notify();
    });
  }
} else if (this.sync) {
  this.run();
} else {
  queueWatcher(this);
}
// getAndInvoke 函数会重新计算，然后对比新旧值，如果变化了则执行回调函数，那么这里这个回调函数是 this.dep.notify()，在我们这个场景下就是触发了渲染 watcher 重新渲染
getAndInvoke (cb: Function) {
  const value = this.get()
  if (
    value !== this.value ||
    // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated.
    isObject(value) ||
    this.deep
  ) {
    // set new value
    const oldValue = this.value
    this.value = value
    this.dirty = false
    if (this.user) {
      try {
        cb.call(this.vm, value, oldValue)
      } catch (e) {
        handleError(e, this.vm, `callback for watcher "${this.expression}"`)
      }
    } else {
      cb.call(this.vm, value, oldValue)
    }
  }
}
```

对于计算属性这样的 computed watcher，它实际上是有 2 种模式，lazy 和 active。如果 this.dep.subs.length === 0 成立，则说明没有人去订阅这个 computed watcher 的变化，仅仅把 this.dirty = true，只有当下次再访问这个计算属性的时候才会重新求值。

getAndInvoke 函数会重新计算，然后对比新旧值，如果变化了则执行回调函数，那么这里这个回调函数是 this.dep.notify()

**确保不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化才会触发渲染 watcher 重新渲染，本质上是一种优化**

## watch

我们自定义的 watch ，和 初始化 computed 过程 没什么不同。只是细节，参数不同。具体不看代码了，在 `src/core/instance/state.js` 里的 `initWatch` 函数。注意：**是一个 `user watcher`**

- 侦听属性 watch 最终会调用 \$watch 方法。
- 这个方法首先判断 cb 如果是一个对象，则调用 createWatcher 方法，这是因为 \$watch 方法是用户可以直接调用的，它可以传递一个对象，也可以传递函数。
- 接着执行 `const watcher = new Watcher(vm, expOrFn, cb, options)` 实例化了一个 watcher，这里需要注意一点这是一个 `user watcher`，因为 `options.user = true`。

直接看 `new Watcher` 各个参数的不同

```js
// src/core/observer/watcher.js
if (options) {
  this.deep = !!options.deep;
  this.user = !!options.user;
  this.computed = !!options.computed;
  this.sync = !!options.sync;
  // ...
} else {
  this.deep = this.user = this.computed = this.sync = false;
}
```

## deep watcher

对象做深度观测的时候，需要设置这个属性为 true.

```js
watch: {
  a: {
    deep: true,
    handler(newVal) {
      console.log(newVal)
    }
  }
}
```

## user watcher
```js
Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```
通过 vm.\$watch 创建的 watcher 是一个 user watcher( options.user = true)，其实它的功能很简单，在对 watcher 求值以及在执行回调函数的时候，会处理一下错误

```js
get() {
  if (this.user) {
    handleError(e, vm, `getter for watcher "${this.expression}"`)
  } else {
    throw e
  }
},
getAndInvoke() {
  // ...
  if (this.user) {
    try {
      this.cb.call(this.vm, value, oldValue)
    } catch (e) {
      handleError(e, this.vm, `callback for watcher "${this.expression}"`)
    }
  } else {
    this.cb.call(this.vm, value, oldValue)
  }
}
```

## computed watcher

## sync watcher

在我们之前对 setter 的分析过程知道，当响应式数据发送变化后，触发了 watcher.update()，只是把这个 watcher 推送到一个队列中，在 nextTick 后才会真正执行 watcher 的回调函数。而一旦我们设置了 sync，就可以在当前 Tick 中同步执行 watcher 的回调函数

```js
update () {
  if (this.computed) {
    // ...
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }

```

这一块，可在 nextTick 中加深理解。

## 总结

计算属性适合用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑。
