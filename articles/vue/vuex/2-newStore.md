## Store 类
通常我们在使用过程中会new一个Store的实例。看下这个类內部的实现。
```js
const moduleA = {
    namespaced: true,
    state: {
        count:1,
    },
    mutations: {
        increment(state){
            state.count++;
        }
    },
    actions: {
        increment(context){
            context.commit('increment')
        }
    },
    getters: {
        computedCount(state){
            return state.count + 1
        }
    }
}
new Vuex.Store({
    modules:{
        a:moduleA
    },
    state: {},
    mutations: {},
    actions: {},
    getters: {}
})
```
### constructor
构造方法，先定义了一些私有属性。
```js
// store internal state
    this._committing = false //检测state是否是被正确途径改变的变量
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options) //构造modules，主要
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()
    this._makeLocalGettersCache = Object.create(null)

    //省略

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], this._modules.root)

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    //变得响应式
    resetStoreVM(this, state)
```

#### new ModuleCollection(options)
```js
constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false)
}
//...
register (path, rawModule, runtime = true) {
    if (__DEV__) {
      assertRawModule(path, rawModule)
    }

    const newModule = new Module(rawModule, runtime)
    if (path.length === 0) {
      this.root = newModule
    } else {
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
    }

    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }

```
1. rawModule是你开始new的时候，传入的对象
2. ``new Module()``方法实例module(很简单，保留_rawModule，并且定义addChild方法，形成父子结构)
3. 遍历modules，如同上面写的 moduleA。key 加上名字。
4. 通过这个register函数，生成module树状结构。

#### installModule
+ 递归modules，把对应的``mutations``,``actions``等。添加到store对应的_属性名下。
+ 在store上生成所有你需要的属性，方法。因为有可是多个module，所以会根据你定义的key来重命名``key/``.
+ 有一个``makeLocalContext``，方法来拿到local。这样你在各自的module调用``mutations``,``actions``的时候。只需要写各自modules里的名字。

####  resetStoreVM
```js
get state () {
    return this._vm._data.$$state
}
//....----------
const computed = {}
forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure environment.
    computed[key] = partial(fn, store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })
//...------------
store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
```
+ state和getters都相当于挂在一个Vue实例上。
+ 访问store.state，是访问_vm._data.$$state
+ 访问store.getters，是访问拼接好的计算属性。这个computed生成方法也不复杂。forEachValue
+ store.strict的值 决定是否执行函数enableStrictMode，只允许通过api来修改。不能手动改。
+ 判断是否有oldVm，$destroy()。