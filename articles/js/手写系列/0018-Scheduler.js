class Scheduler {
  constructor(count) {
    this.count = count
    // 待运行的任务
    this.queue = []
    // 正在运行的任务
    this.runningTasks = 0
  }

  add(task) {
    return new Promise(resolve => {
      task.resolve = resolve
      if (this.runningTasks < this.count) {
        // 运行任务
        this.schedule(task)
      } else {
        // 放入待运行队列中
        this.queue.push(task)
      }
    })
  }

  schedule(task) {
    this.runningTasks++
    // this.run.push(task);
    task().then(() => {
      task.resolve()
      // 移除当前任务
      // this.removeRunTask(task);
      this.runningTasks--

      // 增加新的任务
      if (this.queue.length > 0) {
        const newTask = this.queue.shift()
        this.schedule(newTask)
      }
    })
  }
}

const timeout = time =>
  new Promise(resolve => {
    setTimeout(resolve, time)
  })

const scheduler = new Scheduler(2)
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log('order', order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

// fn([['a', 'b'], ['n', 'm'], ['0', '1']]) => ['an0', 'am0', 'an1', 'am1', 'bn0', 'bm0', 'bn1', 'bm0']
function f(matrix) {
  const result = []
  const len = matrix.length
  function dfs(res, curr) {
    if (res.length === len) {
      result.push(res.join(''))
      return
    }
    for (let i = 0; i < matrix[curr].length; i++) {
      res.push(matrix[curr][i])
      dfs(res, curr + 1)
      res.pop()
    }
  }
  dfs([], 0)
  return result
}

class U {
  constructor() {
    this.promise = Promise.resolve()
  }

  console(val) {
    this.promise = this.promise.then(() => {
      console.log(val)
    })
    return this
  }

  setTimeout(wait) {
    this.promise = this.promise.then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, wait)
      })
    })
    return this
  }
}
const u = new U()
u.console('breakfast').setTimeout(3000).console('lunch').setTimeout(3000).console('dinner')

