# calss 类组件中的 state

## setState 发生了什么

- 首先，setState 会产生当前更新的优先级（老版本用 expirationTime ，新版本用 lane ）。
- 接下来 React 会从 fiber Root 根部 fiber 向下调和子节点，调和阶段将对比发生更新的地方，更新对比 expirationTime ，找到发生更新的组件，合并 state，然后触发 render 函数，得到新的 UI 视图层，完成 render 阶段。
- 接下来到 commit 阶段，commit 阶段，替换真实 DOM ，完成此次更新流程。
- 此时仍然在 commit 阶段，会执行 setState 中 callback 函数,如上的()=>{ console.log(this.state.number) }，到此为止完成了一次 setState 全过程。

![](../../../Images/react/setState%E6%B5%81%E7%A8%8B.png)

**render 阶段 render 函数执行 -> commit 阶段真实 DOM 替换 -> setState 回调函数执行 callback 。**

## setState 同步或异步

setState 并不是单纯同步/异步的，它的表现会因调⽤场景的不同⽽不同：在 React 钩⼦函数及合成 事件中，它表现为异步；⽽在 setTimeout、setInterval 等函数中，包括在 DOM 原⽣事件中，它都表 现为同步。这种差异，本质上是由 React 事务机制和批量更新机制的⼯作⽅式来决定的。

(React-Dom 中提供了批量更新方法 unstable_batchedUpdates，可以去手动批量更新)

### setState 批量更新

在 React 事件执行之前通过 isBatchingEventUpdates=true 打开开关，开启事件批量更新，当该事件结束，再通过 isBatchingEventUpdates = false; 关闭开关，然后在 scheduleUpdateOnFiber 中根据这个开关来确定是否进行批量更新。

(批量更新策略，往队列里赛任务，只会更新最后一次的 setState， **isBatchingUpdates**)

```js
function batchedEventUpdates(fn, a) {
  /* 开启批量更新  */
  isBatchingEventUpdates = true
  try {
    /* 这里执行了的事件处理函数， 比如在一次点击事件中触发setState,那么它将在这个函数内执行 */
    return batchedEventUpdatesImpl(fn, a, b)
  } finally {
    /* try 里面 return 不会影响 finally 执行  */
    /* 完成一次事件，批量更新  */
    isBatchingEventUpdates = false
  }
}
```

# 函数组件中的 state

```js
export default function Index(props) {
  const [number, setNumber] = React.useState(0)
  /* 监听 number 变化 */
  React.useEffect(() => {
    console.log('监听number变化，此时的number是:  ' + number)
  }, [number])
  const handerClick = () => {
    /** 高优先级更新 **/
    ReactDOM.flushSync(() => {
      setNumber(2)
    })
    /* 批量更新 */
    setNumber(1)
    /* 滞后更新 ，批量更新规则被打破 */
    setTimeout(() => {
      setNumber(3)
    })
  }
  console.log(number)
  return (
    <div>
      <span> {number}</span>
      <button onClick={handerClick}>number++</button>
    </div>
  )
}
// 2 1 3
```

当调用改变 state 的函数 dispatch，在本次函数执行上下文中，是获取不到最新的 state 值的.

原因很简单，函数组件更新就是函数的执行，在函数一次执行过程中，函数内部所有变量重新声明，所以改变的 state ，只有在下一次函数组件执行时才会被更新。所以在如上同一个函数执行上下文中，number 一直为 0，无论怎么打印，都拿不到最新的 state 。

```js
const [number, setNumber] = React.useState(0)
const handleClick = () => {
  ReactDOM.flushSync(() => {
    setNumber(2)
    console.log(number)
  })
  setNumber(1)
  console.log(number)
  setTimeout(() => {
    setNumber(3)
    console.log(number)
  })
}
// 0 0 0
```

# 区别

相同点：

- 从原理角度出发，setState 和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规则

不同点：

- 在不是 pureComponent 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。

- setState 有专门监听 state 变化的回调函数 callback，可以获取最新 state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用。

- setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。
