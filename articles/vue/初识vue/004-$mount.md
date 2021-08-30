# $mount
## entry-runtime-with-compiler
在入口文件`platform/web/entry-runtime-with-compiler.js`中可以看到这个方法，首先是缓存了原来的$mount，加入了`Runtime + Compiler`版本`在线编译`的代码，然后重新执行原来的$mount。
- 判断有没有render方法
- 如果没有，还要去拿到符合的`template`,根据写法不同，可能是el，也可能直接写了`template`
- 拿到`template`后，根据`compileToFunctions`，在线编译，返回`render, staticRenderFns`
- 执行原来的$mount

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

## 原来的$mount
在`platform/web/runtime/index.js`里可以看到：这里只是执行了 `mountComponent`这个函数。
```js
import { mountComponent } from 'core/instance/lifecycle'
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```
## mountComponent
在 `mountComponent`这个函数里，真正有了挂在的逻辑。
- 首先判断有无 render （Vue都是靠**render**来渲染）
- 声明`updateComponent`函数，此函数会执行`_update`和`_render`
- 实例化一个渲染`Watcher`, 在它的回调函数中会调用 `updateComponent` 方法
- `vm._render` 方法先生成虚拟 `Node`，最终调用 `vm._update` 更新 `DOM`
- 这个`Watcher` 一是初始化的时候会执行回调函数，二是vm 实例中的监测的数据发生变化的时候执行回调函数
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

