# \$mount

## entry-runtime-with-compiler

在入口文件`platform/web/entry-runtime-with-compiler.js`中可以看到这个方法，首先是缓存了原来的$mount，加入了`Runtime + Compiler`版本`在线编译`的代码，然后重新执行原来的$mount。

- 判断有没有 render 方法
- 如果没有，还要去拿到符合的`template`,根据写法不同，可能是 el，也可能直接写了`template`
- 拿到`template`后，根据`compileToFunctions`，在线编译，返回`render, staticRenderFns`
- 执行原来的\$mount

```js
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el?: string | Element, hydrating?: boolean): Component {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(`Do not mount Vue to <html> or <body> - mount to normal elements instead.`);
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function
  // 如果手写了render 就不会去生成，所以会覆盖写的template 或者 el
  if (!options.render) {
    let template = options.template;
    if (template) {
      // 拿到符合的template
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(`Template element not found or is empty: ${options.template}`, this);
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile');
      }
      //根据 template 用compileToFunctions函数编译，返回 render, staticRenderFns 函数
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== 'production',
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(`vue ${this._name} compile`, 'compile', 'compile end');
      }
    }
  }
  // 执行原来的 mount
  return mount.call(this, el, hydrating);
};
```

## 原来的\$mount

在`platform/web/runtime/index.js`里可以看到：这里只是执行了 `mountComponent`这个函数。

```js
import { mountComponent } from 'core/instance/lifecycle';
// public mount method
Vue.prototype.$mount = function (el?: string | Element, hydrating?: boolean): Component {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};
```

## mountComponent

在 `mountComponent`这个函数里，真正有了挂在的逻辑。

- 首先判断有无 render （Vue 都是靠**render**来渲染）
- 声明`updateComponent`函数，此函数会执行`_update`和`_render`
- 实例化一个渲染`Watcher`, 在它的回调函数中会调用 `updateComponent` 方法
- `vm._render` 方法先生成虚拟 `Node`，最终调用 `vm._update` 更新 `DOM`
- 这个`Watcher` 一是初始化的时候会执行回调函数，二是 vm 实例中的监测的数据发生变化的时候执行回调函数
- 最后根节点的时候设置 `vm._isMounted` 为 true, 同时执行 `mounted` 钩子函数

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    // 创建空节点
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      // 没有template 也没有render 直接警告
    }
  }
  callHook(vm, 'beforeMount') //生命周期

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    //性能记录，监控相关
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }
  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  // 实例化一个渲染Watcher，在它的回调函数中会调用 updateComponent 方法，在此方法中调用 vm._render 方法先生成虚拟 Node，最终调用 vm._update 更新 DOM。
  // Watcher 是一个观察者模式
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  // 根节点的时候设置 `vm._isMounted` 为 true, 同时执行 `mounted` 钩子函数
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
```

# \_render()

`_render()`这个函数之前有看到过，首先他是在`core/instance/index.js`里的`renderMixin(Vue)`方法定义的。

```js
import { renderMixin } from './render';
function Vue(options) {
  //...
  this._init(options);
}
//...
renderMixin(Vue);
```

继续看`renderMixin(Vue)`,它是挂载了两个方法`$nextTick, _render`。

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this;
  const { render, _parentVnode } = vm.$options;
  if (_parentVnode) {
    vm.$scopedSlots = normalizeScopedSlots(_parentVnode.data.scopedSlots, vm.$slots);
  }
  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode;
  // render self
  let vnode;
  try {
    // 核心代码
    vnode = render.call(vm._renderProxy, vm.$createElement);
  } catch (e) {
    //....
  }
  // if the returned array contains only a single node, allow it
  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0];
  }
  // return empty vnode in case the render function errored out
  if (!(vnode instanceof VNode)) {
    if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
      // 模版只能有一个根结点
    }
    vnode = createEmptyVNode();
  }
  // set parent
  vnode.parent = _parentVnode;
  return vnode;
};
```
`const { render, _parentVnode } = vm.$options;` 从$options 里拿到了 `render`方法。  （这个方法可以是用户自己写，也可以是编译生成）

之前说了`_render`函数是生成`vnode`，所以核心代码`vnode = render.call(vm._renderProxy, vm.$createElement)`, call 传入两个参数执行

- `_renderProxy`生产环境就是当前实例`vm`(\_init 的时候定义)
- `$createElement` 是在`initRender()` 的时候定义的。  

从下面手写render函数例子代码中可以看出，render 函数，最终执行了`$createElement`这个函数。
之前看到过`initRender()`也是在`new Vue`时`this._init(options)`里执行的。`initRender()`中定义了 `$createElement`

```js
import { createElement } from '../vdom/create-element'
export function initRender(vm: Component) {
  // 两个相同的 createElement，只是最后一个值不同
  // 这个是被编译生成的render函数执行
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
  // 这个是手写render函数的时候执行
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
}
// render函数例子
<div id="app">
  {{ message }}
</div>
//就是下面这个render
// 如果是手写了render，会覆盖template 或者 el
render: function (createElement) {
  return createElement('div', {
     attrs: {
        id: 'app'
      },
  }, this.message)
}
```
# createElement