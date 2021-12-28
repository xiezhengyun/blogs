# 快照沙箱(snapshotSandbox)
>  激活沙箱时，将window的快照信息存到windowSnapshot中， 如果modifyPropsMap有值，还需要还原上次的状态；激活期间，可能修改了window的数据；退出沙箱时，将修改过的信息存到modifyPropsMap里面，并且把window还原成初始进入的状态。

> 在应用运行的时候保存一个快照window对象，将当前window对象的全部属性都复制到快照对象上，子应用卸载的时候将window对象修改做个diff，将不同的属性用个modifyMap保存起来，再次挂载的时候再加上这些修改的属性。

```js
const iter = (window, callback) => {
  for (const prop in window) {
    if(window.hasOwnProperty(prop)) {
      callback(prop);
    }
  }
}
class SnapshotSandbox {
  constructor() {
    this.proxy = window;
    this.modifyPropsMap = {};
  }
  // 激活沙箱
  active() {
    // 缓存active状态的window
    this.windowSnapshot = {};
    iter(window, (prop) => {
      this.windowSnapshot[prop] = window[prop];
    });
    Object.keys(this.modifyPropsMap).forEach(p => {
      window[p] = this.modifyPropsMap[p];
    })
  }
  // 退出沙箱
  inactive(){
    iter(window, (prop) => {
      if(this.windowSnapshot[prop] !== window[prop]) {
        // 记录变更
        this.modifyPropsMap[prop] = window[prop];
        // 还原window
        window[prop] = this.windowSnapshot[prop];
      }
    })
  }
}

```