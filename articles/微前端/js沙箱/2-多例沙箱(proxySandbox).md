# 代理沙箱(proxySandbox)

> 激活沙箱后，每次对 window 取值的时候，先从自己沙箱环境的 fakeWindow 里面找，如果不存在，就从 rawWindow(外部的 window)里去找；当对沙箱内部的 window 对象赋值的时候，会直接操作 fakeWindow，而不会影响到 rawWindow。

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/dcaa67799031e434da083ca339e82953554f470c.png)

```js
class ProxySandbox {
  active() {
    this.sandboxRunning = true;
  }
  inactive() {
    this.sandboxRunning = false;
  }
  constructor() {
    const rawWindow = window;
    const fakeWindow = {};
    const proxy = new Proxy(fakeWindow, {
      set: (target, prop, value) => {
        if (this.sandboxRunning) {
          target[prop] = value;
          return true;
        }
      },
      get: (target, prop) => {
        // 如果fakeWindow里面有，就从fakeWindow里面取，否则，就从外部的window里面取
        let value = prop in target ? target[prop] : rawWindow[prop];
        return value;
      },
    });
    this.proxy = proxy;
  }
}
```
