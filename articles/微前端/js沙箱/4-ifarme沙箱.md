# iframe 实现沙箱

- 通过 iframe 对象，把原生浏览器对象通过`contentWindow`取出来，这个对象天然具有所有的属性，而且与主应用的环境隔离

- 只有同域的 ifame 才能取出对应的`contentWindow`, iframe 的 src 设置为`about:blank`,可以保证一定是同域的，也不会发生资源加载

```js
class SandboxWindow {
  /**
   * 构造函数
   * @param {*} context 需要共享的对象
   * @param {*} frameWindow iframe的window
   */
  constructor(context, frameWindow) {
    return new Proxy(frameWindow, {
      get(target, name) {
        if (name in context) {
          // 优先使用共享对象
          return context[name];
        }
        return target[name];
      },
      set(target, name, value) {
        if (name in context) {
          // 修改共享对象的值
          return (context[name] = value);
        }
        target[name] = value;
      },
    });
  }
}

// 需要全局共享的变量
const context = { document: window.document, history: window.history };

// 创建沙箱
const newSandboxWindow = new SandboxWindow(context, sandboxGlobal);

// 判断沙箱上的对象和全局对象是否相等
console.log('equal', newSandboxWindow.document === window.document);

newSandboxWindow.abc = '1'; //在沙箱上添加属性
console.log(window.abc); // 在全局上查看属性
console.log(newSandboxWindow.abc); //在沙箱上查看属性
```
