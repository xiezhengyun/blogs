# 状态管理

现代前端框架都需要状态管理，比如组件之间的状态共享，父子组件，兄弟组件，为了满足这些情况，有时候会写很多麻烦代码。更别说还有全局状态这种情况。

# Store

其实最简单的全局状态`window.store = {}`， 没错，这在一定程度上就可以满足基本的需求了。但是为了更好的调式，和知道什么时候改变而代码不容易出 bug，我们需要规定 store 的写法：一个简单的`Store`模式

```js
var store = {
  state: {
    message: 'Hello!',
  },
  setMessageAction(newValue) {
    // 发生改变记录点日志啥的
    this.state.message = newValue;
  },
  clearMessageAction() {
    this.state.message = '';
  },
};
```

- state 里面存储数据
- action 来改变数据，同时做点别的。
  规定只能通过 action 来改变 state 的数据，这样可以知道 state 是如何被改变的。这样就是 Flux 的原理

# Flux

Flux 把一个应用分成了 4 个部分： `View Action Dispatcher Store`

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/dc3ca2c2a101ed35f85e23ecfe386e33c7a557a7.png)

Flux 要求，View 要想修改 Store，必须经过一套流程，有点像我们刚才 Store 模式里面说的那样。视图先要告诉 Dispatcher，让 Dispatcher dispatch 一个 action，Dispatcher 就像是个中转站，收到 View 发出的 action，然后转发给 Store

- View 视图
- Action 用来改变 Store
- Dispatcher 的作用是接收所有的 Action，然后发给所有的 Store。

**Flux 的最大特点就是数据都是单向流动的。**

# Redux

Flux 一个应用可以拥有多个 Store，多个 Store 之间可能有依赖关系；Store 封装了数据还有处理数据的逻辑。
一种“更先进”的状态管理方式出现了 Redux

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/423b8c4658d32e0702060a65c74c988913fe43bb.jpg)

- Store Redux 里只有一个 store。 整个应用的数据都在这个大 Store 里面。Store 的 State 不能直接修改，每次只能返回一个新的 State

- Action Redux 里面也有 Action，Action 就是 View 发出的通知，告诉 Store State 要改变。

- Reducer Redux 没有 Dispatcher 的概念，Store 里面已经集成了 dispatch 方法。**store.dispatch()是 View 发出 Action 的唯一方法。**

Redux 用一个叫做 Reducer 的纯函数来处理事件。Store 收到 Action 以后，必须给出一个新的 State（就是刚才说的 Store 的 State 不能直接修改，每次只能返回一个新的 State），这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。
（Redux 的 Reducer 就是 reduce 一个列表（action 的列表）和一个 initialValue（初始的 State）到一个新的 value（新的 State））

Redux 有三大原则：

- 单一数据源：Flux 的数据源可以是多个。
- State 是只读的：Flux 的 State 可以随便改。
- 使用纯函数来执行修改：Flux 执行修改的不一定是纯函数。

# 中间件

以上这些都只能实现同步操作，如果是异步就需要中间件来补充。

> 在 Redux 中，同步的表现就是：Action 发出以后，Reducer 立即算出 State。那么异步的表现就是：Action 发出以后，过一段时间再执行 Reducer。

异步操作加在哪里是一个问题，Reducer 是一个纯函数，Action 更只是一个对象，更好的实践是：**View 里发送 Action 的时候，加上一些异步操作**

```js
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
};
```
**中间件简单来说，就是对 store.dispatch 方法进行一些改造的函数**

```js
// Redux 提供了一个 applyMiddleware 方法来应用中间件：
// redus-promise redux-thunk 
const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)
);
```