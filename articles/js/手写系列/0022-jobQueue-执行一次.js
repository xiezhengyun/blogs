//调用多少次 flushJob 函数，在一个周期内都只会执行一次
// 定义一个任务队列
const jobQueue = new Set()
// 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列
const p = Promise.resolve()

// 一个标志代表是否正在刷新队列
let isFlushing = false
function flushJob() {
  // 如果队列正在刷新，则什么都不做
  if (isFlushing) return
  // 设置为 true，代表正在刷新
  isFlushing = true
  // 在微任务队列中刷新 jobQueue 队列
  p.then(() => {
    jobQueue.forEach(job => job())
  }).finally(() => {
    // 结束后重置 isFlushing
    isFlushing = false
  })
}
let a = new Proxy(
  { val: 1 },
  {
    set(target, props, val) {
      target[props] = val
      jobQueue.add(logA)
      return true
    },
  }
)
const logA = () => {
  console.log('a', a)
}

// 连续修改a 的值，只会打印出最后一次 a 的值
a.val++
a.val++
a.val++
flushJob()