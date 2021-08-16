# vue 源码目录
```
src
├── compiler        # 编译相关 
├── core            # 核心代码 
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```

## compiler 编译相关
compiler目录包含vue所有编译相关的代码。主要有**模板解析成 ast 语法树**，**ast 语法树优化**，**代码生成**等功能。
编译的工作可以在构建时候做，此时可以借助打包工具webpack，以及**vue-loader**。  
也可以在运行时做，但是runtime编译更耗性能，推荐---离线编译

## core 核心代码
core 目录包含了 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等等。

## platforms 不同平台的支持
vue跨平台，支持web 以及 也可以配合 weex 跑在 native 客户端上。  
platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。

## server 服务端渲染

## sfc .vue 文件解析
通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过 .vue 单文件来编写组件。  
这个目录下的代码类似一个**解释器**，会把 .vue 文件内容解析成一个 JavaScript 的对象。

## shared
shared里定义的工具方法都是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享


