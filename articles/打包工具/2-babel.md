# babel

Babel 是 JavaScript 编译器：他能让开发者在开发过程中，直接使用各类方言（如 TS、Flow、JSX）或新的语法特性，而不需要考虑运行环境，因为 Babel 可以做到按需转换为低版本支持的代码；Babel 内部原理是将 JS 代码转换为 AST，对 AST 应用各种插件进行处理，最终输出编译后的 JS 代码。

## AST 抽象语法树

以树的形式来表现编程语言的语法结构, 类似虚拟 dom。定义很多字段来描述当前代码。

AST 是源代码的高效表示，能便捷的表示大多数编程语言的结构。适用于做代码分析或转换等需求。之所以用树来进行分析或转换，是因为树能使得程序中的每一节点恰好被访问一次（前序或后序遍历）。

常见使用场景：代码压缩混淆功能可以借助 AST 来实现：分析 AST，基于各种规则进行优化（如 IF 语句优化；移除不可访问代码；移除 debugger 等），从而生成更小的 AST 树，最终输出精简的代码结果。

## Babel 编译流程

![](../../Images//webpack/babel.png)

- 解析阶段：Babel 默认使用 @babel/parser 将代码转换为 AST。解析一般分为两个阶段：词法分析和语法分析

  - 词法分析：对输入的字符序列做标记化(tokenization)操作
  - 语法分析：处理标记与标记之间的关系，最终形成一颗完整的 AST 结构。

- 转换阶段：Babel 使用 @babel/traverse 提供的方法对 AST 进行深度优先遍历，调用插件对关注节点的处理函数，按需对 AST 节点进行增删改操作。

- 生成阶段：Babel 默认使用 @babel/generator 将上一阶段处理后的 AST 转换为代码字符串。

## webpack 中使用

- 在 webpack 中如果想使用 babel 的编译功能，需要安装 babel-loader。

  ```bash
  npm install --save-dev babel-loader @babel/core
  ```

- 通过 config

  ```js
  {
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ]
    }
  }
  ```

- Create babel.config.json configuration file(还可以在package.json中设置babel字段。)

  在项目的根目录中创建一个 babel.config.json 文件并启用一些 presets。

  ```bash
  npm install @babel/preset-env --save-dev
  ```

  为了让 preset 生效，你需要像下面这样定义你的 babel.config.json 文件：

  ```js
  {
    "presets": ["@babel/preset-env"]
  }
  ```


## plugin-transform-runtime和babel-polyfill

plugin-transform-runtime主要是负责将工具函数转换成引入的方式，减少重复代码，而babel-polyfill则是引入相关文件模拟兼容环境。babel-polyfill有一个问题就是引入文件会污染变量，其实plugin-transform-runtime也提供了一种runtime的polyfill。

> runtime 不污染全局变量，但是会导致多个文件出现重复代码。

> 写类库的时候用runtime，系统项目还是用polyfill。

>写库使用 runtime 最安全，如果我们使用了 includes，但是我们的依赖库 B 也定义了这个函数，这时我们全局引入 polyfill 就会出问题：覆盖掉了依赖库 B 的 includes。如果用 runtime 就安全了，会默认创建一个沙盒,这种情况 Promise 尤其明显，很多库会依赖于 bluebird 或者其他的 Promise 实现,一般写库的时候不应该提供任何的 polyfill 方案，而是在使用手册中说明用到了哪些新特性，让使用者自己去 polyfill。
