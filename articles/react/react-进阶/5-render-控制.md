## 什么时候会render

- 当组件的状态改变时
- 当父组件re-render时
- 当一个组件使用Context，并且Provider的值发生变化时

## 控制 render

React 提供了几种控制 render 的方式, 究其本质主要是有 2 种方式

- 从父组件直接隔断子组件的渲染，经典的就是 memo，缓存 element 对象
- 组件从自身来控制是否 render ，比如：PureComponent, shouldComponentUpdate

### 从父组件直接隔断子组件的渲染 memo

useMemo 会记录上一次执行 create 的返回值，并把它绑定在函数组件对应的 fiber 对象上，只要组件不销毁，缓存值就一直存在，但是 deps 中如果有一项改变，就会重新执行 create ，返回值作为新的值记录到 fiber 对象上。

```js
export default function Index() {
  const [numberA, setNumberA] = React.useState(0)
  const [numberB, setNumberB] = React.useState(0)
  return (
    <div>
      {useMemo(
        () => (
          <Children number={numberA} />
        ),
        [numberA]
      )}
      <button onClick={() => setNumberA(numberA + 1)}>改变numberA</button>
      <button onClick={() => setNumberB(numberB + 1)}>改变numberB</button>
    </div>
  )
}
```

原理： 每次执行 render 本质上 createElement 会产生一个新的 props，这个 props 将作为对应 fiber 的 pendingProps ，在此 fiber 更新调和阶段，React 会对比 fiber 上老 oldProps 和新的 newProp （ pendingProps ）是否相等，如果相等函数组件就会放弃子组件的调和更新，从而子组件不会重新渲染；

**如果上述把 element 对象缓存起来，上面 props 也就和 fiber 上 oldProps 指向相同的内存空间，也就是相等，从而跳过了本次更新**。

### PureComponent

纯组件是一种发自组件本身的渲染优化策略，当开发类组件选择了继承 PureComponent ，就意味这要遵循其渲染规则。规则就是浅比较 state 和 props 是否相等。

```js
function checkShouldComponentUpdate() {
  if (typeof instance.shouldComponentUpdate === 'function') {
    return instance.shouldComponentUpdate(newProps, newState, nextContext) /* shouldComponentUpdate 逻辑 */
  }
  // 如果是纯组件
  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
  }
}
```

注意事项：

- 避免使用箭头函数。不要给是 PureComponent 子组件绑定箭头函数，因为父组件每一次 render ，如果是箭头函数绑定的话，都会重新生成一个新的箭头函数， PureComponent 对比新老 props 时候，因为是新的函数，所以会判断不想等，而让组件直接渲染，PureComponent 作用终会失效。

- PureComponent 的父组件是函数组件的情况，绑定函数要用 useCallback 或者 useMemo 处理。因为函数组件每一次执行，如果不处理，还会声明一个新的函数，所以 PureComponent 对比同样会失效

useCallback 和 useMemo 有什么区别？

useCallback 第一个参数就是缓存的内容，useMemo 需要执行第一个函数，返回值为缓存的内容，比起 useCallback ， useMemo 更像是缓存了一段逻辑，或者说执行这段逻辑获取的结果。

### shouldComponentUpdate

### React.memo

`React.memo(Component,compare)`

React.memo 可作为一种容器化的控制渲染方案，可以对比 props 变化，来决定是否渲染组件，首先先来看一下 memo 的基本用法。React.memo 接受两个参数，第一个参数 Component 原始组件本身，第二个参数 compare 是一个函数，可以根据一次更新中 props 是否相同决定原始组件是否重新渲染。

- React.memo: 第二个参数 返回 true 组件不渲染 ， 返回 false 组件重新渲染。和 shouldComponentUpdate 相反，shouldComponentUpdate : 返回 true 组件渲染 ， 返回 false 组件不渲染。
- memo 当二个参数 compare 不存在时，会用浅比较原则处理 props ，相当于仅比较 props 版本的 pureComponent 。
- memo 同样适合类组件和函数组件。

```js
function updateMemoComponent() {
  if (updateExpirationTime < renderExpirationTime) {
    let compare = Component.compare
    compare = compare !== null ? compare : shallowEqual //如果 memo 有第二个参数，则用二个参数判定，没有则浅比较props是否相等。
    if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime) //已经完成工作停止向下调和节点。
    }
  }
  // 返回将要更新组件,memo包装的组件对应的fiber，继续向下调和更新。
}
```

### 渲染控制流程图
![](../../../Images//react//render%E6%8E%A7%E5%88%B6.png)


## 打破渲染控制
- forceUpdate。类组件更新如果调用的是 forceUpdate 而不是 setState ，会跳过 PureComponent 的浅比较和 shouldComponentUpdate 自定义比较。其原理是组件中调用 forceUpdate 时候，全局会开启一个 hasForceUpdate 的开关。当组件更新的时候，检查这个开关是否打开，如果打开，就直接跳过 shouldUpdate 。

- context穿透，上述的几种方式，都不能本质上阻断 context 改变，而带来的渲染穿透，所以开发者在使用 Context 要格外小心，既然选择了消费 context ，就要承担 context 改变，带来的更新作用。


## 注意的点

- 如果你想将内联函数中的 props 提取到useCallback中的原因是为了避免子组件re-render，那么不要这样做,它不会起作用
- 如果组件使用了状态，找到那些不依赖于其他状态的组件，并对它们进行memo（useMemo）缓存，以最小化re-render次数。
- 永远不要在另一个组件的渲染函数中创建新的组件
- 在使用Context时，确保如果 value 属性不是数字、字符串或布尔值，则始终使用 memo缓存