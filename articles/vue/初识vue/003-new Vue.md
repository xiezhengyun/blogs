# src/core/instance/index

上一篇讲到 vue 定义的地方，在初始化 vue 实例也就是 new 一个`Vue`的时候，又发生了什么？
首先看代码：

```js
import { initMixin } from './init';
import { stateMixin } from './state';
import { renderMixin } from './render';
import { eventsMixin } from './events';
import { lifecycleMixin } from './lifecycle';
import { warn } from '../util/index';

function Vue(options) {
  //...
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
```

`new Vue()` 的时候回执行`this._init(options)`，这个函数是在`initMixin`里定义的。主要做的事

- uid++
- merge options
- 初始化一系列函数，生命周期，事件，render，数据等
- 最后 执行`$mount` 挂载（这个方法之前也见到过）

```js
/* @flow */
import { initState } from './state';
export function initMixin(Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this;
    // a uid
    vm._uid = uid++;

    let startTag, endTag;
    /* istanbul ignore if */

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    //...
    /* istanbul ignore else */
    //...
    // expose real self
    vm._self = vm;
    initLifecycle(vm); //生命周期
    initEvents(vm); // 事件
    initRender(vm); // render
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm); // 初始化数据
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(`vue ${vm._name} init`, startTag, endTag);
    }

    if (vm.$options.el) {
      console.log(`这里执行挂载函数，vm.$mount`);
      vm.$mount(vm.$options.el);
    }
  };
}
```

其中比较有意思一点是，`initState`，在初始化 Vue 的 `data， props， methods`里定义的 state，会在当前实例通过 this 全局拿到。
所以在 state.js 文件里能够看到。注释很清楚。在demo里也有例子, 用的script引入的 UMD 的 `Runtime + Compiler` 版本。
```js
// 把vue 里定义的 data， props， methods统一挂在到当前实例 vm
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm) //挂载data
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
// 挂载 定义的 data，
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    //..这里做的事 props，methods，data 不能有相同名字
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key) //这里就是做的 代理， 访问的时候，this.state === this._data.state
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```
