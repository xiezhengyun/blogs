## API

#### state 和 getters

在之前 newStore 中讲过。重新定义了 state 和 getters。
在 installModule 中的 makeLocalContext 函数

```js
// getters and state object must be gotten lazily
// because they will be changed by vm update
Object.defineProperties(local, {
    getters: {
        get: noNamespace ? () => store.getters : () => makeLocalGetters(store, namespace),
    },
    state: {
        get: () => getNestedState(store.state, path),
    },
});
//..
function makeLocalGetters(store, namespace) {
    if (!store._makeLocalGettersCache[namespace]) {
        const gettersProxy = {};
        const splitPos = namespace.length;
        Object.keys(store.getters).forEach((type) => {
            // skip if the target getter is not match this namespace
            if (type.slice(0, splitPos) !== namespace) return;

            // extract local getter type
            const localType = type.slice(splitPos);

            // Add a port to the getters proxy.
            // Define as getter property because
            // we do not want to evaluate the getters in this time.
            Object.defineProperty(gettersProxy, localType, {
                get: () => store.getters[type],
                enumerable: true,
            });
        });
        store._makeLocalGettersCache[namespace] = gettersProxy;
    }

    return store._makeLocalGettersCache[namespace];
}
```

#### mapState 和 mapGetters
```js
export const mapState = normalizeNamespace((namespace, states) => {
    const res = {}
  if (__DEV__ && !isValidMap(states)) {
    console.error('[vuex] mapState: mapper parameter must be either an Array or an Object')
  }
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      let state = this.$store.state
      let getters = this.$store.getters
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})

function normalizeNamespace (fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}

//调用
...mapState([
    'count'
])
...mapState('a',{
    aCount:'aCount'
})
```
+ 先看mapState是 normalizeNamespace的返回值。就是我们调用mapState的时候，传入参数namespace, map。
+ normalizeMap 构造key:value数据返回
+ mapState一般解构在computed里，在外面调用这个计算属性时，执行mappedState方法。

