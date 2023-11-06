# computed
- computed 首先 需要 lazy，非立即执行
- 多次访问，能缓存值
- 另外一个 effect 中读取计算属性的值时会出现 effect 嵌套 。对于计算属性的
getter 函数来说，它里面访问的响应式数据只会把 computed 内部
的 effect 收集为依赖。而当把计算属性用于另外一个 effect 时，
就会发生 effect 嵌套，外层的 effect 不会被内层 effect 中的响
应式数据收集


## scheduler (调度器)
所谓可调度，指的是当 trigger 动作触发副作用函数重新执行时，有能力决定*副作用函数*执行的时机、次数以及方式。

```js
// 注册副作用函数，同时它也允 许指定一些选项参数 options，例如指定 scheduler 调度器来控制副作用函数的执行时机和方式
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    // 当调用 effect 注册副作用函数时，将副作用函数赋值给 activeEffect
    activeEffect = effectFn
    // 在调用副作用函数之前将当前副作用函数压栈
    effectStack.push(effectFn)
    fn()
    // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
  // 将 options 挂载到 effectFn 上
  effectFn.options = options // 新增
  // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
}

// 有了调度函数，我们在 trigger 函数中触发副作用函数重新执行时，就可以直接调用用户传递的调度器函数，从而把控制权交给用户

// 来触发副作用函数重新执行的 trigger 函数。
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)

  const effectsToRun = new Set()
  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn)
      }
    })
  effectsToRun.forEach(effectFn => {
    // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数 传递
    if (effectFn.options.scheduler) {
      // 新增
      effectFn.options.scheduler(effectFn) // 新增
    } else {
      // 否则直接执行副作用函数（之前的默认行为）
      effectFn() // 新增
    }
  })
}
```
利用 scheduler ，可以做到 决定*副作用函数*执行的时机、次数以及方式。

## couputed lazy
- 通过 options 传递 lazy
- 执行fn。并通过 effectFn 返回 fn 的执行结果res
```js
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    // 当调用 effect 注册副作用函数时，将副作用函数赋值给 activeEffect
    activeEffect = effectFn
    // 在调用副作用函数之前将当前副作用函数压栈
    effectStack.push(effectFn)
    const res = fn() // 新增
    // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    // 将 res 作为 effectFn 的返回值
    return res // 新增
  }
  // 将 options 挂载到 effectFn 上
  effectFn.options = options // 新增
  // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  // effectFn()
  if (!options.lazy) {
    effectFn()
  }
  return effectFn()
}
```

## 缓存值
- 通过 scheduler ，定义 dirty
- 会在 getter 函数中所依赖的响应式数据变化时执行，这样在 scheduler 函
数内将 dirty 重置为 true

```js
 function computed(getter) {
   // value 用来缓存上一次计算的值
   let value
   // dirty 标志，用来标识是否需要重新计算值，为 true 则意味着“脏”，需要计算
   let dirty = true
   const effectFn = effect(getter, {
     lazy: true,
     // 添加调度器，在调度器中将 dirty 重置为 true
     scheduler() {
      dirty = true
     }
   })
   const obj = {
     get value() {
       // 只有“脏”时才计算值，并将得到的值缓存到 value 中
       if (dirty) {
         value = effectFn()
         // 将 dirty 设置为 false，下一次访问直接使用缓存到 value 中的值
         dirty = false
       }
       return value
     },
   }
   return obj
 }
```

## 另外一个 effect 中读取计算属性的值时会出现 effect 嵌套
当读取计算属性的值时，我们可以手动调用 track 函数进行追踪；当计算属性依赖的响应式数据发生变化时， 可以手动调用 trigger 函数触发响应

```js
function computed(getter) {
   // value 用来缓存上一次计算的值
   let value
   // dirty 标志，用来标识是否需要重新计算值，为 true 则意味着“脏”，需要计算
   let dirty = true
   const effectFn = effect(getter, {
     lazy: true,
     // 添加调度器，在调度器中将 dirty 重置为 true
     scheduler() {
      dirty = true
      // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响
      trigger(obj, 'value')
     }
   })
   const obj = {
     get value() {
       // 只有“脏”时才计算值，并将得到的值缓存到 value 中
       if (dirty) {
         value = effectFn()
         // 将 dirty 设置为 false，下一次访问直接使用缓存到 value 中的值
         dirty = false
       }
       // 当读取 value 时，手动调用 track 函数进行追踪
       track(obj, 'value')
       return value
     },
   }
   return obj
 }
```