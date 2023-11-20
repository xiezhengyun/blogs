function foo() {
  console.log(1)
  setTimeout(() => {
    console.log('timer1')
    Promise.resolve().then(function () {
      console.log('promise1')
    })
  }, 0)
  process.nextTick(() => {
    console.log('nextTick')
    process.nextTick(() => {
      console.log('nextTick')
      process.nextTick(() => {
        console.log('nextTick')
        process.nextTick(() => {
          console.log('nextTick')
        })
      })
    })
  })
  console.log(2)
  // 1,2 ,nextTick=>nextTick=>nextTick=>nextTick=>timer1=>promise1
}
/**
 *  timers定时器：本阶段执行已经安排的 setTimeout() 和 setInterval() 的回调函数。
    pending callbacks待定回调：执行延迟到下一个循环迭代的 I/O 回调。
    idle, prepare：仅系统内部使用。
    poll 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，它们由计时器和 setImmediate() 排定的之外），其余情况 node 将在此处阻塞。
    check 检测：setImmediate() 回调函数在这里执行。
    close callbacks 关闭的回调函数：一些准备关闭的回调函数，如：socket.on('close', ...)。
 */

function test() {
  console.log('start')
  setTimeout(() => {
    console.log('children2')
    Promise.resolve().then(() => {
      console.log('children2-1')
    })
  }, 0)
  setImmediate(()=>{
    console.log('setImmediate')
  })
  setTimeout(() => {
    console.log('children3')
    Promise.resolve().then(() => {
      console.log('children3-1')
    })
  }, 0)
  Promise.resolve().then(() => {
    console.log('children1')
  })
  console.log('end')
}

test()

// 以上代码在node11以下版本的执行结果(先执行所有的宏任务，再执行微任务)
// start
// end
// children1
// children2
// children3
// children2-1
// children3-1
// setImmediate

// 以上代码在node11及浏览器的执行结果(顺序执行宏任务和微任务)
// start
// end
// children1
// children2
// children2-1
// children3
// children3-1
// setImmediate
