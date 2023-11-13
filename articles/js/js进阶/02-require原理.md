# JS模块加载器加载原理是怎么样的？

- 一种方法是, 让这个文件里的代码在一个函数内运行，然后返回想要提供给外界的接口。
- 另一种方法是，让这个文件去修改由外部提供给它的一个对象以藉由这个对象来给外界提供接口。

```js
function require(path) {
  if (require.cache[path]) {
    return require.cache[path].exports
  }
  var src = fs.readFileSync(path)
  var code = new Function('exports, module', src)
  var module = {exports:{}}
  code(module.exports, module)
  require.cache[path] = module
  return module.exports
}
require.cache = Object.create(null)
```

把模块对应的文件读出来，通过文件的内容动态构建一个函数，构建出来的这个函数是有两个参数的（上面几个模块系统的实现实际上把require函数也做为参数传进去了），一个名为exports，一个名为module，而且exports是module对象的一个属性，它本身也是个空对象。

将exports与module做为参数调用刚刚通过模块文件的内容构建出来的函数，在模块内部，实际上就是在修改exports对象或者是module.exports对象（如果你用过任意一个模块系统这应该是很熟悉的）这个函数运行完成后，module这个对象应该就已经被修改为想要的样子了，把得到的内容缓存以便下次直接返回，同时本次也返回得到的module就完事了

