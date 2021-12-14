# js 沙箱

> JS 沙箱的核心在于修改 js 作用域和重写 window

我们基座和子应用的 js 代码是运行在同一个 window 下面. 这样可能产生一些问题，如全局变量冲突、全局事件监听和解绑.

例如: 在 window 下挂载的变量, 冲突, 或者全局的事件监听`addEventListener`等. 如何去解决这些问题.

## 全局变量冲突

首先: 基座的 window 不好改,而且子应用挂载,卸载. 应该动的是子应用. 所以我们的想法是从子应用的 window 来着手.

> Proxy 进行代理操作，代理对象为空对象 microWindow, 代理在子应用里访问的 window

```js
export default class SandBox {
  active = false; // 沙箱是否在运行
  microWindow = {}; // // 代理的对象
  injectedKeys = new Set(); // 新添加的属性，在卸载时清空

  constructor(appName) {
    this.releaseEffect = effect(this.microWindow);
    this.proxyWindow = new Proxy(this.microWindow, {
      // 取值
      get: (target, key) => {},
      // 设置变量
      set: (target, key, value) => {},
      deleteProperty: (target, key) => {},
    });
  }
  // 启动
  start() {}
  // 停止
  stop() {}
  // 修改js作用域 将子应用的window指向代理的对象
  bindScope(code) {
    window.proxyWindow = this.proxyWindow;
    return `;(function(window, self){ 
              with(window){;${code}\n}}
            ).call(window.proxyWindow, window.proxyWindow, window.proxyWindow);`;
  }
}
```

在 app.js 里初始化了 `Sandbox` 之后, 在执行 js 的过程中, 利用`bindScope`函数, `with` 改变代码的作用域, 把默认 window 改成 `window.proxyWindow`, 也就是 `this.proxyWindow`.

这样, 就能解决 window 上变量冲突问题.

## 全局事件函数

全局事件应该随着子应用的卸载而卸载. 可以主动去卸载,但是 这是理想情况, 应该做的是 自动将子应用残余的全局监听事件进行清空.

我们在沙箱中重写 window.addEventListener 和 window.removeEventListener，记录所有全局监听事件，在应用卸载时如果有残余的全局监听事件则进行清空。

```js
//sandbox.js

// 记录addEventListener、removeEventListener原生方法
const rawWindowAddEventListener = window.addEventListener;
const rawWindowRemoveEventListener = window.removeEventListener;

/**
 * 重写全局事件的监听和解绑
 * @param microWindow 原型对象
 */
function effect(microWindow) {
  // 使用Map记录全局事件
  const eventListenerMap = new Map();

  // 重写addEventListener
  microWindow.addEventListener = function (type, listener, options) {
    const listenerList = eventListenerMap.get(type);
    // 当前事件非第一次监听，则添加缓存
    if (listenerList) {
      listenerList.add(listener);
    } else {
      // 当前事件第一次监听，则初始化数据
      eventListenerMap.set(type, new Set([listener]));
    }
    // 执行原生监听函数
    return rawWindowAddEventListener.call(window, type, listener, options);
  };

  // 重写removeEventListener
  microWindow.removeEventListener = function (type, listener, options) {
    const listenerList = eventListenerMap.get(type);
    // 从缓存中删除监听函数
    if (listenerList?.size && listenerList.has(listener)) {
      listenerList.delete(listener);
    }
    // 执行原生解绑函数
    return rawWindowRemoveEventListener.call(window, type, listener, options);
  };

  // 清空残余事件
  return () => {
    console.log('需要卸载的全局事件', eventListenerMap);
    // 清空window绑定事件
    if (eventListenerMap.size) {
      // 将残余的没有解绑的函数依次解绑
      eventListenerMap.forEach((listenerList, type) => {
        if (listenerList.size) {
          for (const listener of listenerList) {
            rawWindowRemoveEventListener.call(window, type, listener);
          }
        }
      });
      eventListenerMap.clear();
    }
  };
}
```

代码并不复杂, 记录原生方法, 然后重写自己的作用域的 监听方法, 过程中记录下 所有方法. 然后执行原生方法. 然后再子应用卸载的时候, 去清空这些记录下来的事件
