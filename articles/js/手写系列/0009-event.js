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
