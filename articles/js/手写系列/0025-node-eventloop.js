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

function test() {
  console.log('start')
  setTimeout(() => {
    console.log('children2')
    Promise.resolve().then(() => {
      console.log('children2-1')
    })
  }, 0)
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

// 以上代码在node11及浏览器的执行结果(顺序执行宏任务和微任务)
// start
// end
// children1
// children2
// children2-1
// children3
// children3-1
