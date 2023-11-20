# 局部刷新

页面的跳转、局部内容的刷新是 web 应用中使用最多的场景。想象一下，如果我们只刷新了页面的内容，但是 URL 并没有改变，当用户刷新当前页面的时候，原先的内容会丢失，需要重新操作进入到对应的页面中，这是比较糟糕的一种体验。

我们可以**把页面的内容匹配到对应的路由信息中**，即使是 ctrl+F5 这样的强制刷新，URL 信息也不会丢，用户依然可以快速恢复原先的页面浏览信息，这也是我们要设计和使用路由的很重要的原因。

# 前端路由

在过去，服务端处理来自浏览器的请求时，要根据不同的 URL 路由拼接出对应的视图页面，通过 Http 返回给浏览器进行解析渲染。使用这种方式加载页面，整个页面都需要重新加载，导致体验不够友好。

Web 应用则是使用了局部刷新的能力，**改变视图的同时不会向后端发出请求**，在路由信息变更的时候进行局部页面内容的刷新（而不是重新加载一个完整的页面），从而获取更好的体验。

## Hash

Hash 模式主要依赖 Location 对象的 hash 属性（location.hash）和 hashchange 事件

## 1.Location 对象。

`window.location` 用来获取 `Location` 对象的引用。`Location` 对象存储在 `Window` 对象的 `Location` 属性中，表示当前 Web 地址

| Location 属性 | 描述                                      | 示例，`https://www.test.com/en-US/search?q=URL#search-results` |
| ------------- | ----------------------------------------- | -------------------------------------------------------------- |
| hash          | 设置或返回从井号(#)开始的 URL（锚）       | `#search-results`                                              |
| host          | 设置或返回主机名和当前 URL 的端口号       | `www.test.com`                                                 |
| hostname      | 设置或返回当前 URL 的主机名               | `www.test.com`                                                 |
| href          | 设置或返回完整的 URL                      | `https://www.test.com/en-US/search?q=URL#search-results`       |
| pathname      | 设置或返回当前 URL 的路径部分             | `/en-US/search`                                                |
| port          | 设置或返回当前 URL 的端口号               | 默认 80 端口                                                   |
| protocol      | 设置或返回当前 URL 的协议                 | `https:`                                                       |
| search        | 设置或返回从问号(?)开始的 URL（查询部分） | `?q=URL`                                                       |

location.hash 的设置和获取，并不会造成页面重新加载

## 2.hashchange 事件。

当一个窗口的 hash 改变时就会触发 `hashchange` 事件。`hashchange` 事件对象有两个属性，newURL 为当前页面新的 URL，oldURL 为当前页面旧的 URL。

```js
window.addEventListener('hashchange', () => {
  // 把改变后的url地址栏的url赋值给data的响应式数据current，调用router-view去加载对应的页面
  this.data.current = window.location.hash.substr(1);
});
```

## history

History 的路由模式，依赖了一个关键的属性 window.history。

`window.history` 是一个只读属性，用来获取 History 对象的引用。History 对象提供了操作浏览器会话历史（浏览器地址栏中访问的页面，以及当前页面中通过框架加载的页面）的接口，使用 window.history 我们可以实现以下与路由相关的重要能力：

- (1) 在 history 中跳转。

  使用`window.history.back()`、`window.history.forward()`和`window.history.go()`方法来完成在用户历史记录中向后和向前的跳转

- (2) 添加和修改历史记录中的条目。

  HTML5 引入了`history.pushState()`和`history.replaceState()`方法，它们分别可以添加和修改历史记录条目。这两个 API 都会操作浏览器的历史栈，而不会引起页面的刷新。

  - `history.pushState()` 增加一条新的历史记录
  - `history.replaceState()`替换当前的历史记录

    ```js
    /**
     * parameters
     * @state {object} 状态对象 state 是一个 JavaScript 对象，一般是JSON格式的对象字面量
     * @title {string} 可以理解为 document.title，在这里是作为新页面传入参数的
     * @url {string} 该参数定义了增加或改变的历史 URL 记录，可以是相对路径或者绝对路径，url的具体格式可以自定
     */
    history.pushState(state, title, url); // 向浏览器历史栈中增加一条记录
    history.replaceState(state, title, url); // 替换历史栈中的当前记录
    ```

- (3) 监听 popstate 事件。

  当同一个页面在历史记录间切换时，就会产生 `popstate` 事件，`popstate` 事件会被传递给 `window` 对象，所以页面路由切换通常会与 `window.onpopstate` 配合使用。

  `history.pushState()`或者`history.replaceState()`调用不会触发 popstate 事件。（需要针对解决）

  popstate 事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在 JavaScript 中调用 history.back()、history.forward()、history.go()方法)。

  所以我们可以结合 popstate 事件、pushState()和 replaceState()来完成完整的路由监听和修改能力。

  如果当前处于激活状态的历史记录条目是由 history.pushState()方法创建，或者由 history.replaceState()方法修改过的, 则 popstate 事件对象的 state 属性包含了这个历史记录条目的 state 对象的一个拷贝

  `pushState`方法、`replaceState`方法，只能导致`history`对象发生变化，从而改变当前地址栏的 URL，但浏览器不会向后端发送请求，也不会触发 popstate 事件的执行

  ```js
  // 假如当前网页地址为http://example.com/example.html
  window.onpopstate = function (event) {
    alert('location: ' + document.location + ', state: ' + JSON.stringify(event.state));
  };
  //绑定事件处理函数
  //添加并激活一个历史记录条目 http://example.com/example.html?page=1,条目索引为1
  history.pushState({ page: 1 }, 'title 1', '?page=1');
  //添加并激活一个历史记录条目 http://example.com/example.html?page=2,条目索引为2
  history.pushState({ page: 2 }, 'title 2', '?page=2');
  //修改当前激活的历史记录条目 http://ex..?page=2 变为 http://ex..?page=3,条目索引为3
  history.replaceState({ page: 3 }, 'title 3', '?page=3');

  history.back(); // 弹出 "location: http://example.com/example.html?page=1, state: {"page":1}"
  history.back(); // 弹出 "location: http://example.com/example.html, state: null
  history.go(2); // 弹出 "location: http://example.com/example.html?page=3, state: {"page":3}
  ```

## history 的 hash 区别

- history:

  利用了 `pushState()` 和 `replaceState()` 方法。（需要特定浏览器支持）
  这两个方法应用于浏览器的历史记录栈，在当前已有的 `back、forward、go` 的基础之上，它们提供了对历史记录进行修改的功能。只是当它们执行修改时，虽然改变了当前的 URL，但浏览器不会立即向后端发送请求。

  http 并没有去请求服务器该路径下的资源，一旦刷新就会暴露这个实际不存在的“羊头”，显示 404（因为浏览器一旦刷新，就是去真正请求服务器资源）

  需要服务端配置：将不存在的路径请求重定向到入口文件（index.html)

- hash：  
  **hash 它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。**

## history 优势

- pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL；
- pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中；
- pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串；
- pushState() 可额外设置 title 属性供后续使用。

## history 监听路由的变化

当我们用 history 的路由时，必然要能监听到路由的变化才行。全局有个 popstate 事件，别看这个事件名称中有个 state 关键词，但 pushState 和 replaceState 被调用时，是不会触发触发 popstate 事件的，只有上面列举的 其他 3 个方法会触发.

针对这种情况，我们可以使用 window.dispatchEvent 添加事件:

```js
const listener = function (type) {
  var orig = history[type];
  return function () {
    var rv = orig.apply(this, arguments);
    var e = new Event(type);
    e.arguments = arguments;
    window.dispatchEvent(e);
    return rv;
  };
};
window.history.pushState = listener('pushState');
window.history.replaceState = listener('replaceState');

window.addEventListener('pushState', this.refresh, false);
window.addEventListener('replaceState', this.refresh, false);
```

## history 实现

```js
class HistoryRouter {
  currentUrl = '';
  handlers = {};

  constructor() {
    this.refresh = this.refresh.bind(this);
    this.addStateListener();
    window.addEventListener('load', this.refresh, false);
    window.addEventListener('popstate', this.refresh, false);
    window.addEventListener('pushState', this.refresh, false);
    window.addEventListener('replaceState', this.refresh, false);
  }
  addStateListener() {
    const listener = function (type) {
      var orig = history[type];
      return function () {
        var rv = orig.apply(this, arguments);
        var e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
      };
    };
    window.history.pushState = listener('pushState');
    window.history.replaceState = listener('replaceState');
  }
  refresh(event) {
    this.currentUrl = location.pathname;
    this.emit('change', location.pathname);
    document.querySelector('#app span').innerHTML = location.pathname;
  }
  on(evName, listener) {
    this.handlers[evName] = listener;
  }
  emit(evName, ...args) {
    const handler = this.handlers[evName];
    if (handler) {
      handler(...args);
    }
  }
}
const router = new HistoryRouter();
router.on('change', function (curUrl) {
  console.log(curUrl);
  document.querySelector('.current span').innerHTML = curUrl;
  document.querySelector('.history-len span').innerHTML = history.length;
});
```

## hash

```js
class HashRouter {
  currentUrl = ''; // 当前的URL
  handlers = {};

  constructor() {
    this.refresh = this.refresh.bind(this);
    // 事件hashchange只会在 hash 发生变化时才能触发，而第一次进入到页面时并不会触发这个事件，因此我们还需要监听load事件
    window.addEventListener('load', this.refresh, false);
    window.addEventListener('hashchange', this.refresh, false);
  }

  getHashPath(url) {
    const index = url.indexOf('#');
    if (index >= 0) {
      return url.slice(index + 1);
    }
    return '/';
  }

  refresh(event) {
    let curURL = '',
      oldURL = null;
    if (event.newURL) {
      oldURL = this.getHashPath(event.oldURL || '');
      curURL = this.getHashPath(event.newURL || '');
    } else {
      curURL = this.getHashPath(window.location.hash);
    }
    this.currentUrl = curURL;

    // 当hash路由发生变化时，则触发change事件
    this.emit('change', curURL, oldURL);
  }

  on(evName, listener) {
    this.handlers[evName] = listener;
  }
  emit(evName, ...args) {
    const handler = this.handlers[evName];
    if (handler) {
      handler(...args);
    }
  }
}

const router = new HashRouter();
rouer.on('change', (curUrl, lastUrl) => {
    console.log('当前的hash:', curUrl);
    console.log('上一个hash:', lastUrl);
});

```
