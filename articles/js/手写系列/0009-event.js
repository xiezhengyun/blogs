class EventEmitter {
  constructor() {
    this.events = {}; // 存放着所有的事件{eventName: [callback, ...]}
  }
  // 监听事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [callback];
    } else {
      this.events[eventName].push(callback);
    }
  }
  // 触发事件
  emit(eventName, ...argu) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(fn => fn(...argu));
    }
  }
  // 移除事件
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(fn => callback !== fn && fn.l !== callback);
    }
  }
  // 只监听一次，下次emit不会触发
  once(eventName, callback) {
    const _once = () => {
      callback();
      this.off(eventName, _once);
    };
    _once.l = callback;
    this.on(eventName, _once);
  }
}
let eventBus = new EventEmitter()
let fn1 = function(name, age) {
	console.log(`${name} ${age}`)
}
let fn2 = function(name, age) {
	console.log(`hello, ${name} ${age}`)
}
eventBus.on('aaa', fn1)
eventBus.on('aaa', fn2)
eventBus.emit('aaa', '布兰', 12)
eventBus.on('aaa', fn1)
eventBus.on('aaa', fn2)
eventBus.emit('aaa', '布兰', 12)