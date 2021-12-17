# Vuex

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/4fb73c3495849d5ac2ac80546a8431d563a7da45.png)

一图胜千言，如果图看的迷糊，那就是用的还不够多

## Store

与 Redux 一样，只有一个全局的 Store(多个数据，有一个 Module 的概念)。Vuex 通过 store 选项，把 state 注入到了整个应用中，这样子组件能通过 this.\$store 访问到 state 。State 改变，View 就会跟着改变，这个改变利用的是 Vue 的响应式机制。

```js
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `,
});
```

## Mutation

单向数据流，Vuex 中 State 也不能直接改，通过一个约定的方式来修改，在 Vuex 中就是 Mutation ，更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。

```js
const store = new Vuex.Store({
  state: {
    count: 1,
  },
  mutations: {
    increment(state) {
      // 变更状态
      state.count++;
    },
  },
});
// 调用
store.commit('increment');
```

mutation 都是同步事务。mutation 有些类似 Redux 的 Reducer，但是并不是每次返回一个新的 state，而是可以直接修改 state，这是 Vue 的老本行了。这里不好说哪种方式更好，函数式编程（Functional Programming 简称 FP） 有个概念 `immutability`。不展开

**总的来说都是让 View 通过某种方式触发 Store 的事件或方法，Store 的事件或方法对 State 进行修改或返回一个新的 State，State 改变之后，View 发生响应式改变。**

## Action

Vuex 的 Action 是专门用来处理异步事务的，这里可以类比 Redux 的中间件来理解。Vuex 的思路是把异步和同步操作分开，一些有先后顺序的操作，可以通过 Action 完成后去触发 Mutation。一个 Action 里面可以触发多个 mutation。

当然，也可以不使用 Action，在应用里执行异步操作后，触发 Mutation 也可以。

## 对比 Redux

Redux： view——>actions——>reducer——>state 变化——>view 变化（同步异步一样）  

Vuex： 
- view——>commit——>mutations——>state 变化——>view 变化（同步操作） 
- view——>dispatch——>actions——>mutations——>state 变化——>view 变化（异步操作）
