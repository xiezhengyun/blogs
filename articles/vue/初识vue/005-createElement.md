# createElement
这个方法在`src/core/vdom/create-element.js`中，这里只是对参数做了一些修改，然后调用了`_createElement`来创建`VNode`。
```js
const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```
`_createElement`有五个参数
- context 表示 VNode 的上下文环境，它是 Component 类型
- tag 表示标签，它可以是一个字符串，也可以是一个 Component
- data  表示 VNode 的数据，它是一个 VNodeData 类型，可以在 flow/vnode.js 中找到它的定义
- **children 表示当前 VNode 的子节点，它是任意类型的，它接下来需要被规范为标准的 VNode 数组**
- normalizationType 表示子节点规范的类型，类型不同规范的方法也就不一样，它主要是参考 render 函数是编译生成的还是用户手写的
```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // data 不能是一个响应式的
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 规范化 children ，拍平数组 返回一个数组
  if (normalizationType === ALWAYS_NORMALIZE) {
    // 同样也是拍平数组，对文本节点做了考虑
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // 二维数组转化成一维数组，（函数式组件）
    children = simpleNormalizeChildren(children)
  }
  // 这里开始 VNode 的创建
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      // 是HTML内置的一些节点，则直接创建一个普通 `VNode`。  
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      //直接调用 `createComponent` 创建一个组件类型的 `VNode` 节点
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```
`_createElement`函数主要是做了两个事情
- 规范化 children
- VNode 的创建

## 规范化 children
由于之前 children 入参格式 是any， 所以在实际的创建过程中，要对children 做一些处理，Vnode是描述真实DOM的，真实DOM应该是以一个树状结构，所以某一个节点下，它的children应该是一个单纯的数组（不应该是二维数组）。（当编译 slot、v-for 的时候会产生嵌套数组的情况）

## VNode 的创建
这里先对 `tag` 做判断.
如果是 `string` 类型，则接着判断如果是HTML内置的一些节点，则直接创建一个普通 `VNode`。  

如果是为已注册的组件名，则通过 `createComponent` 创建一个组件类型的 `VNode`，否则创建一个未知的标签的 `VNode`。   

如果是 `tag` 一个 `Component` 类型，则直接调用 `createComponent` 创建一个组件类型的 `VNode` 节点。对于 `createComponent` 创建组件类型的 `VNode` 的过程，本质上它还是返回了一个 `VNode`。