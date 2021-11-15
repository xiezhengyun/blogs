# initEvents

在初始化 Vue 的过程中，执行的 new Vue，执行了 init 函数。

```js
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
    vm._self = vm;
    initLifecycle(vm); // 初始化生命周期
    initEvents(vm); // 初始化事件
    initRender(vm); // 初始化渲染
    callHook(vm, 'beforeCreate'); // 调用生命周期钩子函数
    initInjections(vm); //初始化injections
    initState(vm); // 初始化props,methods,data,computed,watch
    initProvide(vm); // 初始化 provide
    callHook(vm, 'created'); // 调用生命周期钩子函数

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
```

从函数名字上来看，这个初始化函数是初始化实例的事件系统。我们知道，在 Vue 中，当我们在父组件中使用子组件时可以给子组件上注册一些事件，这些事件即包括使用 v-on 或@注册的自定义事件，也包括注册的浏览器原生事件（需要加 .native 修饰符）。

```js
<child @select="selectHandler" 	@click.native="clickHandler"></child>
```

## 解析事件

在模板编译的过程中，当遇到开始标签的时候，除了会解析开始标签，还会调用 processAttrs 方法解析标签中的属性。

```js
export const onRE = /^@|^v-on:/;
export const dirRE = /^v-|^@|^:/;
export const bindRE = /^:|^v-bind:/;
function processAttrs(el) {
  const list = el.attrsList;
  let i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      el.hasBindings = true;
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) {
        // ..
      } else if (onRE.test(name)) {
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn);
      } else {
        // ...
      }
    } else {
      // ...
    }
  }
}

function parseModifiers(name: string): Object | void {
  const match = name.match(modifierRE);
  if (match) {
    const ret = {};
    match.forEach(m => {
      ret[m.slice(1)] = true;
    });
    return ret;
  }
}
```

在对标签属性进行解析时，判断如果属性是指令，首先通过 parseModifiers 解析出属性的修饰符，然后判断如果是事件的指令，则执行 `addHandler(el, name, value, modifiers, false, warn)`方法。

具体方法不放了。

[src/compiler/helpers.js](https://github.com/xiezhengyun/vue/blob/dev/src/compiler/helpers.js#L69)

在 addHandler 函数里做了 3 件事情。

- 首先根据 modifier 修饰符对事件名 name 做处理，
- 接着根据 modifier.native 判断事件是一个浏览器原生事件还是自定义事件，分别对应 el.nativeEvents 和 el.events，
- 最后按照 name 对事件做归类，并把回调函数的字符串保留到对应的事件中。

最后的结果类似：

```js
el.events = {
  select: {
    value: 'selectHandler',
  },
};

el.nativeEvents = {
  click: {
    value: 'clickHandler',
    modifiers: {
      prevent: true,
    },
  },
};
```

然后在模板编译的代码生成阶段，会在 genData 函数中根据 AST 元素节点上的 events 和 nativeEvents 生成\_c(tagName,data,children)函数中所需要的 data 数据，它的定义在 src/compiler/codegen/index.js 中：

[src/compiler/codegen/index.js](https://github.com/xiezhengyun/vue/blob/dev/src/compiler/codegen/index.js#L220)

生成的 data 数据如下：

```js
{
  // ...
  on: {"select": selectHandler},
  nativeOn: {"click": function($event) {
      return clickHandler($event)
    }
  }
  // ...
}
```

模板编译的最终目的是创建 render 函数供挂载的时候调用生成虚拟 DOM，那么在挂载阶段， 如果被挂载的节点是一个组件节点，则通过 createComponent 函数创建一个组件 vnode。

```js
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...
  const listeners = data.on;

  data.on = data.nativeOn;

  // ...
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

  return vnode;
}
```

- 自定义事件 `data.on` 赋值给了 `listeners`
- 把浏览器原生事件 `data.nativeOn` 赋值给了 `data.on`
- 这说明所有的原生浏览器事件处理是在当前父组件环境中处理的
- 对于自定义事件，会把 `listeners` 作为 `vnode` 的 `componentOptions` 传入，放在子组件初始化阶段中处理， 在子组件的初始化的时候， 拿到了父组件传入的 `listeners`，然后在执行 `initEvents` 的过程中，会处理这个 `listeners`。

## 结论

**父组件给子组件的注册事件中，把自定义事件传给子组件，在子组件实例化的时候进行初始化；而浏览器原生事件是在父组件中处理**

换句话说：**实例初始化阶段调用的初始化事件函数 initEvents 实际上初始化的是父组件在模板中使用 v-on 或@注册的监听子组件内触发的事件。**

## initEvents 解析

我们知道，父组件把 当前子组件上的 的 自定义的 on 事件 ，处理成 `listeners`,传递给子组件内部。子组件 实例初始化阶段调用的初始化事件函数 initEvents。

```js
export function initEvents(vm: Component) {
  vm._events = Object.create(null); //vm上新增_events属性并将其赋值为空对象，用来存储事件。
  // init parent attached events
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}
```

- vm 上新增\_events 属性并将其赋值为空对象，用来存储事件。
- 获取父组件注册的事件赋给 listeners，如果 listeners 不为空，则调用 updateComponentListeners 函数，将父组件向子组件注册的事件注册到子组件的实例中

`updateComponentListeners` 只是调用了 updateListeners 函数，并把 listeners 以及 add 和 remove 这两个函数传入。直接看下 `updateListeners`这个函数

```js
export function updateListeners(on: Object, oldOn: Object, add: Function, remove: Function, vm: Component) {
  let name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(`Invalid handler for event "${event.name}": got ` + String(cur), vm);
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove(event.name, oldOn[name], event.capture);
    }
  }
}
```
该函数的作用是对比listeners和oldListeners的不同，并调用参数中提供的add和remove进行相应的注册事件和卸载事件


调用updateComponentListeners函数，将父组件向子组件注册的事件注册到子组件实例中的_events对象里。