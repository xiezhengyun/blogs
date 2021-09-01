# 为什么会有 this

首先有一个基本知识，**`JavaScript`采用的是词法作用域，函数的作用域基于函数创建的位置**。看下面两个例子

```js
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() {
    return scope;
  }
  return f();
}
checkscope();
/**************/
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() {
    return scope;
  }
  return f;
}
checkscope()();
```

这两段代码都会打印`local scope`，因为 scope 的值在函数定义的时候已经确定了。与函数在哪里执行没有关系

> JavaScript 函数的执行用到了作用域链，这个作用域链是在函数定义的时候创建的。嵌套的函数 f() 定义在这个作用域链里，其中的变量 scope 一定是局部变量，不管何时何地执行函数 f()，这种绑定在执行 f() 时依然有效。

现在加入`this` 看一下。

```js
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() {
    return this.scope;
  }
  return f();
}
checkscope(); //global scope
```

很奇妙，打印的值变成了`global scope`。思考一下这 2 个问题？

1. 这里的值为什么会变？
2. 这个值变了有什么好处？

暂时先不回答这 2 个问题，看一下一个新东西，**执行上下文**。

> 当 JavaScript 代码执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

对于每个执行上下文，都有三个重要的属性：

- 变量对象(**Variable object，VO**)
  > 变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。
- 作用域链(Scope chain)
  > 函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。
- this

变量对象先不管，作用域链和 this 都是熟悉的东西，尽管可能还不理解。可以看到，在一段代码执行的过程中，由静态作用域形成的作用域链和 this 是具有“相同地位”。

为什么这么说？第一个例子打印出`local scope`，是因为通过作用域链查找到的。因为是静态作用域，所以值是`local scope`。  
同样的第二个例子打印出`global scope`，是因为通过 this 找到的。至于此时`this`的指向问题先不管。

回答下刚才那两个问题：

- 值为什么会变？查找变量的方式不同了，一个是作用域链，一个是 this
- 值变了有什么好处？我的理解是设计`this`是为了和静态作用域“互补”。也可以说是为了解决静态作用域带来的“麻烦”

# 什么是 this

> this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

> this 实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

上文是 YDKJS 中的描述。可以看出我为什么说`this`和静态作用域互补。要理解 this 到底是什么东西再看下这个例子

```js
var name = '侯丽谢';
var person = {
  name: '王德发',
  sayHi: function () {
    console.log(name);
  },
};
```
