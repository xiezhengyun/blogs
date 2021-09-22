# createComponent

Vue 在`createElement`创建`VNode`的时候，根据`tag`有分为几种情况，普通 HTML 节点或者是 Vue 组件。`createComponent` 就是用来创建 Vue 组件的`VNode`的方法。这个方法在`src/core/vdom/create-component.js`中。

```js
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return;
  }

  const baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context);
    }
    return;
  }

  // async component
  let asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot
    // work around flow
    const slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  // 实例化 VNode
  const name = Ctor.options.name || tag;
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode);
  }

  return vnode;
}
```

代码主要做了三件事

- 构造子类构造函数
- 安装组件钩子函数
- 实例化 vnode

## 构造子类构造函数

构造子类构造函数主要是利用`Vue.extend`函数构造一个 Vue 的子类。

```js
// 这里的 baseCtor 指向了 Vue 对象，在之前的 init.js 过程中。
const baseCtor = context.$options._base;
// plain options object: turn it into a constructor
if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor);
}
```

- extend 函数使用一种非常经典的原型继承的方式把一个纯对象转换一个继承于 Vue 的构造器 Sub 并返回，然后对 Sub 这个对象本身扩展了一些属性，如扩展 options、添加全局 API 等
- 并且对配置中的 props 和 computed 做了初始化工作
- 最后对于这个 Sub 构造函数做了缓存，避免多次执行 Vue.extend 的时候对同一个子组件重复构造。

extend 函数的代码就不贴了。

对于第一步，extend 函数，因为我的例子就是 调用`Vue.component`来注册组件，这里已经不用再执行 extend。

## 安装组件钩子函数

```js
//inline hooks to be invoked on component VNodes during patch
const componentVNodeHooks = {
  init() {},
  prepatch() {},
  insert() {},
  destroy() {},
};
const hooksToMerge = Object.keys(componentVNodeHooks);
// install component management hooks onto the placeholder node
installComponentHooks(data);

function installComponentHooks(data: VNodeData) {
  const hooks = data.hook || (data.hook = {});
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i];
    const existing = hooks[key];
    const toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
    }
  }
}
function mergeHook(f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged;
}
```

Vue 使用的 Virtual DOM 参考的是开源库 <a href="https://github.com/snabbdom/snabbdom">snabbdom</a> 在 VNode 的 patch 流程中对外暴露了各种时机的钩子函数，方便我们做一些额外的事情，Vue.js 也是充分利用这一点，在初始化一个 Component 类型的 VNode 的过程中实现了几个钩子函数。这块可以看成是我们使用的生命周期的更高一层封装。

**`installComponentHooks` 函数就是把钩子函数合并到 `data.hook`, 在 VNode 执行 patch 的过程中执行相关的钩子函数。如果有钩子存在，那么合并，依次执行**

## 实例化 VNode

```js
const name = Ctor.options.name || tag;
const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
  data,
  undefined,
  undefined,
  undefined,
  context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
);
```

**`new VNode` 实例化一个 `vnode` 并返回。需要注意的是和普通元素节点的 `vnode` 不同，组件的 `vnode` 是没有 `children` 的**

## 总结

`createComponent` 函数就是用来创建 Vue 组件的 VNode， 与一般的还是有点区别，可以见例子，自己打断点进去多看几遍。
