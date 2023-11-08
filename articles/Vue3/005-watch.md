# watch

watch 也是通过调度 scheduler，来实现的。

```js
// watch 函数接收两个参数，source 是响应式数据，cb 是回调函数
function watch(source, cb) {
  effect(
    // 触发读取操作，从而建立联系
    () => source.foo,
    {
      scheduler() {
        // 当数据变化时，调用回调函数 cb
        cb()
      },
    }
  )
}
```

为了不需要硬编码指定 foo，现在来一个通用的 watch，watch source 下所有属性

```js
function watch(source, cb) {
  effect(
    // 调用 traverse 递归地读取
    () => traverse(source),
    {
      scheduler() {
        // 当数据变化时，调用回调函数 cb
        cb()
      },
    }
  )
}

function traverse(value, seen = new Set()) {
  // 如果要读取的数据是原始值，或者已经被读取过了，那么什么都不做
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  // 将数据添加到 seen 中，代表遍历地读取过了，避免循环引用引起的死循环
  seen.add(value)
  // 暂时不考虑数组等其他结构
  // 假设 value 就是一个对象，使用 for...in 读取对象的每一个值，并递归地调用 traverse 进行处理
  for (const k in value) {
    traverse(value[k], seen)
  }

  return value
}
```

watch 还可以传入一个 getter 函数，getter 函数内部，用户可以指定该 watch 依赖哪些响应式数据

```js
function watch(source, cb) {
  // 定义 getter
  let getter
  // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
  if (typeof source === 'function') {
    getter = source
  } else {
    // 否则按照原来的实现调用 traverse 递归地读取
    getter = () => traverse(source)
  }
  effect(
    // 执行 getter
    () => getter(),
    {
      scheduler() {
        cb()
      },
    }
  )
}
```

为了实现 watch 的 newValue 和 oldValue 功能

- 使用 lazy 选项创建了一个懒执行的 effect
- 手动调用 effectFn 函数得到的返回值就是旧值
- 变化发生并触发 scheduler 调度函数执行时，会重新调用 effectFn 函数并得到新值
- 更新旧值

```js
function watch(source, cb) {
  // 定义 getter
  let getter
  // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
  if (typeof source === 'function') {
    getter = source
  } else {
    // 否则按照原来的实现调用 traverse 递归地读取
    getter = () => traverse(source)
  }
  // 定义旧值与新值
  let oldValue, newValue
  // 使用 effect 注册副作用函数时，开启 lazy 选项，并把返回值存储到effectFn 中以便后续手动调用
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler() {
      // 在 scheduler 中重新执行副作用函数，得到的是新值
      newValue = effectFn()
      // 将旧值和新值作为回调函数的参数
      cb(newValue, oldValue)
      // 更新旧值，不然下一次会得到错误的旧值
      oldValue = newValue
    },
  })
  // 手动调用副作用函数，拿到的值就是旧值
  oldValue = effectFn()
}
```

立即执行的 watch

- 当 immediate 选项存在并且为 true 时，回调函数会在该 watch 创建时立刻执行一次

```js
function watch(source, cb, options = {}) {
  // 定义 getter
  let getter
  // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
  if (typeof source === 'function') {
    getter = source
  } else {
    // 否则按照原来的实现调用 traverse 递归地读取
    getter = () => traverse(source)
  }
  // 定义旧值与新值
  let oldValue, newValue

  // 提取 scheduler 调度函数为一个独立的 job 函数
  const job = () => {
    newValue = effectFn()
    cb(newValue, oldValue)
    oldValue = newValue
  }

  // 使用 effect 注册副作用函数时，开启 lazy 选项，并把返回值存储到effectFn 中以便后续手动调用
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: job,
  })
  if (options.immediate) {
    // 当 immediate 为 true 时立即执行 job，从而触发回调执行
    job()
  } else {
    // 手动调用副作用函数，拿到的值就是旧值
    oldValue = effectFn()
  }
}
```

通过 flush 指定回调函数的执行时机

```js
function watch(source, cb, options = {}) {
  // 定义 getter
  let getter
  // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
  if (typeof source === 'function') {
    getter = source
  } else {
    // 否则按照原来的实现调用 traverse 递归地读取
    getter = () => traverse(source)
  }
  // 定义旧值与新值
  let oldValue, newValue

  // 提取 scheduler 调度函数为一个独立的 job 函数
  const job = () => {
    newValue = effectFn()
    cb(newValue, oldValue)
    oldValue = newValue
  }

  // 使用 effect 注册副作用函数时，开启 lazy 选项，并把返回值存储到effectFn 中以便后续手动调用
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      // 在调度函数中判断 flush 是否为 'post'，如果是，将其放到微任务队列中执行
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job()
      }
    },
  })
  if (options.immediate) {
    // 当 immediate 为 true 时立即执行 job，从而触发回调执行
    job()
  } else {
    // 手动调用副作用函数，拿到的值就是旧值
    oldValue = effectFn()
  }
}
```

## 竞态问题

watch 函数的回调函数接收第三个参数. onInvalidate，它是一个函数，类似于事件监听器，我们可以使用. onInvalidate 函数注册一个回调，这个回调函数会在当前副作用函数过期时执行.

```js
let finalData
watch(obj, async (newValue, oldValue, onInvalidate) => {
  // 定义一个标志，代表当前副作用函数是否过期，默认为 false，代表没有过期
  let expired = false
  // 调用 onInvalidate() 函数注册一个过期回调
  onInvalidate(() => {
    // 当过期时，将 expired 设置为 true
    expired = true
  })
  // 发送网络请求
  const res = await fetch('/path/to/request')
  // 只有当该副作用函数的执行没有过期时，才会执行后续操作。
  if (!expired) {
    finalData = res
  }
})
```

在发送请求之前，我们定义了 expired 标志变量，用来标识当前副作用函数的执行是否过期；接着调用 onInvalidate 函数注册了一个过期回调，当该副作用函数的执行过期时将 expired 标志变量设置为 true；最后只有当没有过期时才采用请求结果.

```js
function watch(source, cb, options = {}) {
  // 定义 getter
  let getter
  // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
  if (typeof source === 'function') {
    getter = source
  } else {
    // 否则按照原来的实现调用 traverse 递归地读取
    getter = () => traverse(source)
  }
  // 定义旧值与新值
  let oldValue, newValue

  // cleanup 用来存储用户注册的过期回调
  let cleanup
  // 定义 onInvalidate 函数
  function onInvalidate(fn) {
    // 将过期回调存储到 cleanup 中
    cleanup = fn
  }

  // 提取 scheduler 调度函数为一个独立的 job 函数
  const job = () => {
    newValue = effectFn()
    // 在调用回调函数 cb 之前，先调用过期回调
    if (cleanup) {
      cleanup()
    }
    // 将 onInvalidate 作为回调函数的第三个参数，以便用户使用
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  // 使用 effect 注册副作用函数时，开启 lazy 选项，并把返回值存储到effectFn 中以便后续手动调用
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      // 在调度函数中判断 flush 是否为 'post'，如果是，将其放到微任务队列中执行
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job()
      }
    },
  })
  if (options.immediate) {
    // 当 immediate 为 true 时立即执行 job，从而触发回调执行
    job()
  } else {
    // 手动调用副作用函数，拿到的值就是旧值
    oldValue = effectFn()
  }
}
```
