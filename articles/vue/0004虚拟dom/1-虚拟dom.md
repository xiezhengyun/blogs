# 虚拟 DOM

虚拟 DOM，就是用一个 JS 对象来描述一个 DOM 节点

```js
<div class="a" id="b">我是内容</div>
{
  tag:'div',        // 元素标签
  attrs:{           // 属性
    class:'a',
    id:'b'
  },
  text:'我是内容',  // 文本内容
  children:[]       // 子元素
}
```

为什么要有虚拟 dom

- 虚拟 dom 的效率并不一定就比操作真实 dom 高
- 通过虚拟 DOM 的抽象能力，我们拥有了声明式写 UI 的能力，大大提高了我们的「工作效率」
- vdom 把渲染过程抽象化了，从而使得组件的抽象能力也得到提升，并且可以适配 DOM 以外的渲染目标。
- 可以渲染到 DOM 以外的平台，实现 SSR、同构渲染这些高级特性，Weex 等框架应用的就是这一特性。

# vue 的虚拟 dom

```js
// 源码位置：src/core/vdom/vnode.js

export default class VNode {
  constructor(
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag; /*当前节点的标签名*/
    this.data = data; /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
    this.children = children; /*当前节点的子节点，是一个数组*/
    this.text = text; /*当前节点的文本*/
    this.elm = elm; /*当前虚拟节点对应的真实dom节点*/
    this.ns = undefined; /*当前节点的名字空间*/
    this.context = context; /*当前组件节点对应的Vue实例*/
    this.fnContext = undefined; /*函数式组件对应的Vue实例*/
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key; /*节点的key属性，被当作节点的标志，用以优化*/
    this.componentOptions = componentOptions; /*组件的option选项*/
    this.componentInstance = undefined; /*当前节点对应的组件的实例*/
    this.parent = undefined; /*当前节点的父节点*/
    this.raw = false; /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
    this.isStatic = false; /*静态节点标志*/
    this.isRootInsert = true; /*是否作为跟节点插入*/
    this.isComment = false; /*是否为注释节点*/
    this.isCloned = false; /*是否为克隆节点*/
    this.isOnce = false; /*是否有v-once指令*/
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  }

  get child(): Component | void {
    return this.componentInstance;
  }
}
```

# VNode 的类型

- 注释节点
- 文本节点
- 元素节点  
  元素节点更贴近于我们通常看到的真实 DOM 节点，它有描述节点标签名词的 tag 属性，描述节点属性如 class、attributes 等的 data 属性，有描述包含的子节点信息的 children 属性等
- 组件节点  
  componentOptions :组件的 option 选项，如组件的 props 等  
  componentInstance :当前组件节点对应的 Vue 实例
- 函数式组件节点  
  fnContext:函数式组件对应的Vue实例  
  fnOptions: 组件的option选项
- 克隆节点
