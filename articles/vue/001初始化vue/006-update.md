# update

之前看到 通过 render 生成了 VNode ，并将 VNode 作为参数传递给 update 方法。`vm._update(vm._render(), hydrating)`。 具体看下 update 方法。update 方法在 `new Vue()`的过程中也看到过。属于`lifecycleMixin` 定义的三个方法之一。  
update 方法 调用的时机有 2 个，**首次渲染或者数据更新**

```js
export function setActiveInstance(vm: Component) {
  const prevActiveInstance = activeInstance;
  activeInstance = vm;
  return () => {
    activeInstance = prevActiveInstance;
  };
}
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this;
  const prevEl = vm.$el;
  const prevVnode = vm._vnode;
  const restoreActiveInstance = setActiveInstance(vm);
  vm._vnode = vnode; //这里是缓存了的Vnode，比对是否是 首次渲染
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
  restoreActiveInstance(); //activeInstance = prevActiveInstance
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null;
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm;
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el;
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
};
```

可以看到 `_update` 函数，主要是区分了下 是否是 首次渲染，然后调用 `__patch__` 方法。这个方法在 不同的环境中，是不一样的。比如 web 和 weex，甚至在 web 中，浏览器 环境 和 服务端渲染也不同。

```js
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;
```

重点看一下 patch 函数 ，他在 `platforms/web/runtime/patch.js` 中，这里把不同情况的参数组合，传入`createPatchFunction` 这个函数，因为不同平台的这些操作可能会有不同，这样就不用在 `createPatchFunction` 里写 if 来处理不同的情况。

> 函数柯里化的技巧，通过 createPatchFunction 把差异化参数提前固化，这样不用每次调用 patch 的时候都传递 nodeOps 和 modules

- nodeOps 封装了一系列 DOM 操作的方法
- modules 定义了一些模块的钩子函数的实现

```js
/* @flow */
import * as nodeOps from 'web/runtime/node-ops';
import { createPatchFunction } from 'core/vdom/patch';
import baseModules from 'core/vdom/modules/index';
import platformModules from 'web/runtime/modules/index';

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules);
export const patch: Function = createPatchFunction({ nodeOps, modules });
```

`createPatchFunction` 函数的构成非常复杂，包含很多种情况。这里就贴少量代码。`createPatchFunction` 定义在 `src/core/vdom/patch.js`中。

```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
export function createPatchFunction(backend) {
  let i, j;
  const cbs = {};

  const { modules, nodeOps } = backend;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }
  // 根据VNode 创建 真实DOM 并 挂载到真实DOM 上
  function createElm(
    vnode,
    insertedVnodeQueue,
    parentElm, //父节点
    refElm, // 参考的插入节点
    nested,
    ownerArray,
    index
  ) {

    vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode)

    if (__WEEX__) {
        //....weex
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
  }
  // 递归调用 createElm
  // 因为是递归调用，子元素会优先调用 insert，所以整个 vnode 树节点的插入顺序是先子后父。
  function createChildren(vnode, children, insertedVnodeQueue) {}
  // 在  createElm 里调用， 插入
  function insert(parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }
  //执行所有的 create 的钩子并把 vnode push 到 insertedVnodeQueue 中。
  function invokeCreateHooks() {}

  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    // replacing existing element
    const oldElm = oldVnode.elm;
    const parentElm = nodeOps.parentNode(oldElm);
    // create new node
    createElm(
      vnode,
      insertedVnodeQueue,
      // extremely rare edge case: do not insert if old element is in a
      // leaving transition. Only happens when combining transition +
      // keep-alive + HOCs. (#4590)
      oldElm._leaveCb ? null : parentElm,
      nodeOps.nextSibling(oldElm)
    );

    // destroy old node
    // 这里把之前的dom 删除掉， parentElm 代表的是 写的 el 里的dom。{{message}}
    if (isDef(parentElm)) {
      removeVnodes(parentElm, [oldVnode], 0, 0);
    } else if (isDef(oldVnode.tag)) {
      invokeDestroyHook(oldVnode);
    }
  };
}
```
这里的代码逻辑较为复杂，重要的函数已经列出来，主要是要根据例子打断点进去看一下，VNode是怎么变成真实DOM的，然后又是怎么插入到页面中。  

>首次渲染我们调用了 createElm 方法，这里传入的 parentElm 是 oldVnode.elm 的父元素，在我们的例子是 id 为 #app div 的父元素，也就是 Body；实际上整个过程就是递归创建了一个完整的 DOM 树并插入到 Body 上。