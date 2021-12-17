# React-Redux

Redux 和 Flux 类似，只是一种思想，和具体框架没关系。  
但是因为 React 包含函数式的思想，也是单向数据流，和 Redux 很搭，所以一般都用 Redux 来进行状态管理。为了简单处理 Redux 和 React UI 的绑定，一般通过一个叫 react-redux 的库和 React 配合使用。

Redux 将 React 组件分为容器型组件和展示型组件，容器型组件一般通过 connect 函数生成，它订阅了全局状态的变化，通过 mapStateToProps 函数，可以对全局状态进行过滤，而展示型组件不直接从 global state 获取数据，其数据来源于父组件。

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/15b0e8d349ece67546f6c8b9f286cbb1813a473b.jpg)

**react-redux 就是多了个 connect 方法连接容器组件和 UI 组件。**
这里的“连接”就是一种映射：

- mapStateToProps 把容器组件的 state 映射到 UI 组件的 props
- mapDispatchToProps 把 UI 组件的事件映射到 dispatch 方法

## 展示型组件和容器型组件

- 容器型  
  容器型组件知道数据及其结构，以及数据的来源。它们知道是如何运转的，或所谓的业务逻辑。它们接收信息并对其进行处理，以方便展示型组件使用。通常，我们使用 高阶组件 来创建容器型组件，因为它们为我们的自定义逻辑提供了缓冲区。
- 展示型  
  展示型组件只涉及组件的外在展现形式。它们会有附加的 HTML 标记来使得页面更加漂亮。这种组件没有任何绑定及依赖。通常都是实现成 无状态组件，它们没有内部状态。

- 好处：
  将组件分成容器型组件和展示型组件可以增加组件的可复用性。
  容器型组件封装了逻辑，它们可以搭配不同的展示型组件使用，因为它们不参与任何展示相关的工作

## Redux-saga

之前说过两个 Redux 处理异步的中间件 redux-thunk 和 redux-promise，这两个的实现思路都是 **都是把异步请求部分放在了 action creator 中**，Redux-saga 不同。

Redux-saga 把所有的异步操作看成“线程”，可以通过普通的 action 去触发它，当操作完成时也会触发 action 作为输出。其实这也不是什么新概念，可以这么理解：

- redux-thunk 和 redux-promise 可以理解为以前的回调函数
- Redux-saga 可以理解为 async await，同步的语法来执行代码。

Redux-saga 利用了 ES6 的 Generator ，语法是 \* + yield 关键字。 Generator 函数的很多代码可以被延缓执行，也就是具备了暂停和记忆的功能：遇到 yield 表达式，就暂停执行后面的操作，并将紧跟在 yield 后面的那个表达式的值，作为返回的对象的 value 属性值，等着下一次调用 next 方法时，再继续往下执行。

```js
// saga.js
import { take, put } from 'redux-saga/effects';

function* mySaga() {
  // 阻塞: take方法就是等待 USER_INTERACTED_WITH_UI_ACTION 这个 action 执行
  yield take(USER_INTERACTED_WITH_UI_ACTION);
  // 阻塞: put方法将同步发起一个 action
  yield put(SHOW_LOADING_ACTION, { isLoading: true });
  // 阻塞: 将等待 FetchFn 结束，等待返回的 Promise
  const data = yield call(FetchFn, 'https://my.server.com/getdata');
  // 阻塞: 将同步发起 action (使用刚才返回的 Promise.then)
  yield put(SHOW_DATA_ACTION, { data: data });
}
```

## Dva

太麻烦了，React 想要使用一个全局状态管理功能，需要用到 fetch（Ajax），redux 和 redux-saga ，发一次请求需要在 `action、reducer、saga`之间反复横跳。

我们都知道一个编程思想 **约定大于配置**。直接约定好这些内容，把他们放在一起使用，Dva 就出现了:

```js
app.model({
  // namespace - 对应 reducer 在 combine 到 rootReducer 时的 key 值
  namespace: 'products',
  // state - 对应 reducer 的 initialState
  state: {
    list: [],
    loading: false,
  },
  // subscription - 在 dom ready 后执行
  // Redux-Router 还有可能是路由引起的
  subscriptions: [
    function (dispatch) {
      dispatch({ type: 'products/query' });
    },
  ],
  // effects - 对应 saga，并简化了使用
  effects: {
    ['products/query']: function* () {
      yield call(delay(800));
      yield put({
        type: 'products/query/success',
        payload: ['ant-tool', 'roof'],
      });
    },
  },
  // reducers - 就是传统的 reducers
  reducers: {
    ['products/query'](state) {
      return { ...state, loading: true };
    },
    ['products/query/success'](state, { payload }) {
      return { ...state, loading: false, list: payload };
    },
  },
});
```

以前的写法：

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/bcbc37082c1f2e3da31c83ed4e6e1ee2c7bc5879.png)

Dva:

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/e6d815806ed5ba3a6f27a174e77055b990a70501.png)

- 把 store 及 saga 统一为一个 model 的概念（有点类似 Vuex 的 Module）, 写在一个 js 文件里面
- 增加了一个 Subscriptions, 用于收集其他来源的 action, eg: 键盘操作

# 参考

[参考](https://zhuanlan.zhihu.com/p/53599723)
