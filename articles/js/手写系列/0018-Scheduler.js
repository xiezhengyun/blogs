class Scheduler {
  constructor(limit = 2) {
    this.limit = limit;
    this.queue = []; // 模拟队列，先进先出
    this.processTasks = [];
  }
  addTask(...fns) {
    this.queue.push(...fns);
    this.run();
  }
  run() {
    while (this.processTasks.length < this.limit && this.queue.length > 0) {
      let task = this.queue.shift();
      let promise = task().then(() => {
        this.processTasks.splice(this.processTasks.indexOf(promise), 1);
        this.run();
      });
      this.processTasks.push(promise);
    }
  }
}

var task = function (time, order) {
  var fn = function () {
    console.log('开始执行', order);
    return new Promise(resolve => {
      setTimeout(resolve, time);
    }).then(() => console.log('执行完成', order));
  };
  return fn;
};

var scheduler = new Scheduler(2);
scheduler.addTask(task(4000, '1'));
scheduler.addTask(task(500, '2'));
scheduler.addTask(task(500, '3'));
scheduler.addTask(task(400, '4'));
scheduler.addTask(task(300, '5'));
scheduler.addTask(task(300, '6'));
