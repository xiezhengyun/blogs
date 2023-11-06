class EventBus {
  constructor() {
    this.tasks = {} // 按事件名称创建任务队列
  }

  /**
   * 注册事件（订阅）
   * @param {String} type  事件名称
   * @param {Function} fn  回调函数
   */
  on(type, fn) {
    // 如果还没有注册过该事件，则创建对应事件的队列
    if (!this.tasks[type]) {
      this.tasks[type] = []
    }
    // 将回调函数加入队列
    this.tasks[type].push(fn)
  }

  /**
   * 注册一个只能执行一次的事件
   * @params type[String] 事件类型
   * @params fn[Function] 回调函数
   */
  once(type, fn) {
    if (!this.tasks[type]) {
      this.tasks[type] = []
    }

    const that = this
    // 注意该函数必须是具名函数，因为需要删除，但该名称只在函数内部有效
    function _once(...args) {
      fn(...args)
      that.off(type, _once) // 执行一次后注销
    }

    this.tasks[type].push(_once)
  }

  /**
   * 触发事件（发布）
   * @param {String} type  事件名称
   * @param {...any} args  传入的参数，不限个数
   */
  emit(type, ...args) {
    // 如果该事件没有被注册，则返回
    if (!this.tasks[type]) {
      return
    }
    // 遍历执行对应的回调数组，并传入参数
    this.tasks[type].forEach(fn => fn(...args))
  }

  /**
   * 移除指定回调（取消订阅）
   * @param {String} type  事件名称
   * @param {Function} fn  回调函数
   */
  off(type, fn) {
    const tasks = this.tasks[type]
    // 校验事件队列是否存在
    if (!Array.isArray(tasks)) {
      return
    }

    // 利用 filter 删除队列中的指定函数
    this.tasks[type] = tasks.filter(cb => fn !== cb)
  }
}
