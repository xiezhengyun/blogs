/**
   *new Queue()
  .task(1000,()=>console.log(1))
  .task(2000,()=>console.log(2))
  .task(3000,()=>console.log(3)).start();
  实现一个Queue函数，调用start之后，1s后打印1，接着2s后打印2，然后3s后打印3
*/

function sleep(delay, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      callback();
      resolve();
    }, delay);
  });
}
class Queue {
  constructor() {
    this.listenser = [];
  }
  task(delay, callback) {
    // 收集函数
    this.listenser.push(() => sleep(delay, callback));
    return this;
  }
  async start() {
    // 遍历函数
    for (let l of this.listenser) {
      await l();
    }
  }
}

new Queue()
  .task(1000, () => console.log(1))
  .task(2000, () => console.log(2))
  .task(3000, () => console.log(3))
  .start();
