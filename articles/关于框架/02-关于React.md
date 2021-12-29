# React

首先 React 是 `runtime` 层面的，通过 Vdom 描述 DOM，将所有的操作转化为 JS 来完成。摒弃模板，以基于 JS/JSX 的 UI 部件为核心；一旦部件状态改变，就尝试重新渲染；用 vdom 优化渲染资源。

```js
UI = f(State);

// 使得State成为页面的唯一数据来源和页面元素变换的唯一依据
```

这样可以说更纯粹, 从某种角度来说更简单。但是这样一来，JS 要做的事情就太多了，也带来了下面一系列的概念，优化。

## 什么是时间切片 （time slice）

主流浏览器刷新频率为 60Hz，即每（1000ms / 60Hz）16.6ms 浏览器刷新一次。

JS 可以操作 DOM，GUI 渲染线程与 JS 线程是互斥的。所以 JS 脚本执行和浏览器布局、绘制不能同时执行。

在每 16.6ms 时间内，需要完成如下工作：

```
JS脚本执行 -----  样式布局 ----- 样式绘制
```

当 JS 执行时间过长，超出了 16.6ms，这次刷新就没有时间执行样式布局和样式绘制了。

如何解决： 在浏览器每一帧的时间中，预留一些时间给 JS 线程，React 利用这部分时间更新组件， 当预留的时间不够用时，React 将线程控制权交还给浏览器使其有时间渲染 UI，React 则等待下一帧时间到来继续被中断的工作。

> 这种将长任务分拆到每一帧中，像蚂蚁搬家一样一次执行一小段任务的操作，被称为时间切片（time slice）

时间切片的关键是: **将同步的更新变为可中断的异步更新。**

## React15 架构

### Reconciler（协调器）—— 负责找出变化的组件

`React` 中可以通过 `this.setState、this.forceUpdate、ReactDOM.render` 等 API 触发更新。

每当有更新发生时，Reconciler 会做如下工作：

- 调用函数组件、或 class 组件的 render 方法，将返回的 JSX 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知 Renderer 将变化的虚拟 DOM 渲染到页面上

### Renderer（渲染器）—— 负责将变化的组件渲染到页面上

`React`对于浏览器的渲染器 `ReactDOM`

### Reconciler（协调器) 的致命缺点， 递归更新

在`Reconciler`中，`mount`的组件会调用`mountComponent`，`update`的组件会调用`updateComponent`。这两个方法都会递归更新子组件。

**由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了 16ms，用户交互就会卡顿。**

## React16 架构

React16 架构可以分为三层：

- `Scheduler`（调度器）—— 调度任务的优先级，高优任务优先进入`Reconciler`
- `Reconciler`（协调器）—— 负责找出变化的组件
- `Renderer`（渲染器）—— 负责将变化的组件渲染到页面上
  可以看到，相较于 React15，React16 中新增了`Scheduler`（调度器）

### Scheduler（调度器）

Scheduler 管理着 taskQueue 和 timerQueue 两个队列，它会定期将 timerQueue 中的过期任务放到 taskQueue 中，然后让调度者通知执行者循环 taskQueue 执行掉每一个任务。执行者控制着每个任务的执行，一旦某个任务的执行时间超出时间片的限制。就会被中断，然后当前的执行者退场，退场之前会通知调度者再去调度一个新的执行者继续完成这个任务，新的执行者在执行任务时依旧会根据时间片中断任务，然后退场，重复这一过程，直到当前这个任务彻底完成后，将任务从 taskQueue 出队。taskQueue 中每一个任务都被这样处理，最终完成所有任务，这就是 Scheduler 的完整工作流程

[这里](https://segmentfault.com/a/1190000039101758)

Scheduler 用任务优先级去实现多任务的管理，优先解决高优任务，用任务的持续调度来解决时间片造成的单个任务中断恢复问题。任务函数的执行结果为是否应该结束当前任务的调度提供参考，另外，在有限的时间片内完成任务的一部分，也为浏览器响应交互与完成任务提供了保障。

### Reconciler（协调器）

在 `React 16` 中更新工作从递归变成了可以中断的循环过程。每次循环都会调用 shouldYield 判断当前是否有剩余时间。

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

- 解决中断更新时 DOM 渲染不完全:  
  Reconciler 与 Renderer 不再是交替工作。当 Scheduler 将任务交给 Reconciler 后，Reconciler 会为变化的虚拟 DOM 打上代表增/删/更新的标记,
  **整个 Scheduler 与 Reconciler 的工作都在内存中进行。只有当所有组件都完成 Reconciler 的工作，才会统一交给 Renderer。**

这里面的实现 从`Stack Reconciler` 变成了 `Fiber Reconciler`

## Fiber

`Fiber` 其实指的是一种数据结构. 单个的`Fiber` 可以这么描述：

```js
const fiber = {
  stateNode, // 节点实例
  child, // 子节点
  sibling, // 兄弟节点
  return, // 父节点
};
```

Fiber 的关键特性如下：

- 增量渲染（把渲染任务拆分成块，匀到多帧）

- 更新时能够暂停，终止，复用渲染任务

- 给不同类型的更新赋予优先级

- 并发方面新的基础能力

增量渲染用来解决掉帧的问题，渲染任务拆分之后，每次只做一小段，做完一段就把时间控制权交还给主线程，而不像之前长时间占用。这种策略叫做cooperative scheduling（合作式调度）.

Fiber Reconciler 每执行一段时间，都会将控制权交回给浏览器，可以分段执行。

为了达到这种效果，就需要有一个调度器 (Scheduler) 来进行任务分配。优先级高的任务（如键盘输入）可以打断优先级低的任务（如 Diff）的执行，从而更快的生效。

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/0807875f69f49bac5e8fda0faef0b58de3304b54.png)

- 阶段一，生成 Fiber 树，得出需要更新的节点信息。这一步是一个渐进的过程，可以被打断。(可以被打断，优先级更高的任务先执行，从框架层面大大降低了页面掉帧的概率)
- 阶段二，将需要更新的节点一次过批量更新，这个过程不能被打断。

### Fiber 树

`Fiber Reconciler` 在阶段一进行 `Diff` 计算的时候，会生成一棵 `Fiber` 树。这棵树是在 `Virtual DOM` 树的基础上增加额外的信息来生成的，它本质来说是一个链表。
> fiber tree实际上是个单链表（Singly Linked List）树结构, [这里](https://github.com/facebook/react/blob/v16.2.0/packages/react-reconciler/src/ReactFiber.js#L91)

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/168d59d08e93fcd2ed7afa5e888869a7f4383f60.png)

Fiber 树在首次渲染的时候会一次过生成。在后续需要 Diff 的时候，会根据已有树和最新 Virtual DOM 的信息，生成一棵新的树。这颗新树每生成一个新的节点，都会将控制权交回给主线程，去检查有没有优先级更高的任务需要执行。如果没有，则继续构建树的过程

如果过程中有优先级更高的任务需要进行，则 Fiber Reconciler 会丢弃正在生成的树，在空闲的时候再重新执行一遍。

在构造 Fiber 树的过程中，Fiber Reconciler 会将需要更新的节点信息保存在 Effect List 当中，在阶段二执行的时候，会批量更新相应的节点

```
DOM
    真实DOM节点
-------
effect
    每个workInProgress tree节点上都有一个effect list
    用来存放diff结果
    当前节点更新完毕会向上merge effect list（queue收集diff结果）
- - - -
workInProgress
    workInProgress tree是reconcile过程中从fiber tree建立的当前进度快照，用于断点恢复
- - - -
fiber
    fiber tree与vDOM tree类似，用来描述增量更新所需的上下文信息
-------
Elements
    描述UI长什么样子（type, props）
```
