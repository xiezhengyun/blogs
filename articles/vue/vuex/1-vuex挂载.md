## Vuex初始化
通常通过``import Vuex from 'vuex'``导入Vuex，这时导入的是一个对象。在src/index.js中定义。
```js
export default {
  Store,
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```
通过Vue.use()使用，实际是执行install方法。在src/store.js里面。
```js
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (__DEV__) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```
1. Vuex单例模式，只允许一个实例
2. 执行``applyMixin()``，通过``Vue.mixin({ beforeCreate: vuexInit })``方法混入。
```js
/**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
```
+ 在beforeCreate钩子使用vuexInit方法。判断是否有store，执行store()生成，或者找父实例的$store。保证全局都是一个store。在组件中通过``this.$store``访问store实例。
+ 实际使用的时候，根组件会传入store。



