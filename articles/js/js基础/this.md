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
person.sayHi(); //1. 侯丽谢
/***********************/
var name = '侯丽谢';
var person = {
  name: '王德发',
  sayHi: function () {
    console.log(this.name);
  },
};
person.sayHi(); //2. 王德发
var fn = person.sayHi;
fn(); // 3. 侯丽谢
```

1. 第一个打印出 侯丽谢，通过作用域链查找，由于当前作用域没有 name，所以找到全局 name 变量
2. 如果想要访问 person 里的 name，加上`this`，在`person.sayHi()`调用的时候，就是访问的`person`里的 name 了

暂停！在这里思考一下，如果没有`this`，按照静态作用的方式，是找不到`person`里的 name 的，如果想要访问，就只能传参进来:

```js
var name = '侯丽谢';
var person = {
  name: '王德发',
  sayHi: function (self) {
    console.log(self.name);
  },
};
person.sayHi(person); //王德发
```

但是想要开发者还是想要这样调用`person.sayHi()`，所以有两种做法。  
第一种： 加一个**形参**`self`  
第二种：隐藏`self`，用`this`访问`self`  
这里就能看出`this`的实质了。用`this`来访问`self`，隐藏`self`。js 采用的是这种做法。  
写过 py 的同学可能更懂了，因为 py 留下 `self` 作为第一个参数， 所以 形参 就会永远比 实参 多出一个 `self`

3. 回到上面例子的第三个调用。根据`this`的定义，在运行时绑定，不难看出，打印的值是 侯丽谢

# 确定 this 的指向

上面讲了这么多，也理解了`this`是什么，为什么要设计`this`，但是还不够，怎么确认`this`的指向也是一个难搞的问题。  
下面的内容大量参考 YDKJS，总结而成：`this`的绑定规则总共是有下面 5 种

- 1、默认绑定（严格/非严格模式）
- 2、隐式绑定
- 3、显式绑定
- 4、new 绑定
- 5、ES6 箭头函数绑定

## 1、默认绑定（严格/非严格模式）

### 非严格模式

```js
var name = 'wang';
function foo() {
  console.log(this.name);
}
foo(); //wang
```

很好理解，默认情况下，非严格模式，`this`就指向全局对象

### 严格模式

- 在严格模式下，不能将全局对象`window`作为默认绑定，此时`this`会绑定到`undefined`
- 但是在严格模式下调用函数则不会影响默认绑定

```js
(() => {
  'use strict';
  var name = 'wang';
  function foo() {
    console.log(this.name);
  }
  foo(); //TypeError: Cannot read property 'name' of undefined
})();
/********************/
var name = 'wang';
function foo() {
  console.log(this.name);
}
(() => {
  'use strict';
  foo(); //wang 调用函数则不会影响默认绑定
})();
```

## 2、隐式绑定

隐式绑定，刚才已经遇到过。当函数作为对象的属性存在，通过对象属性执行函数时，此时隐式绑定规则会将`this`绑定到对象上；

```js
var name = '侯丽谢';
var person = {
  name: '王德发',
  sayHi: function () {
    console.log(this.name);
  },
};
person.sayHi(); // 王德发
```

### 3、隐式丢失

一个常见的`this`绑定问题是被隐式绑定的函数会丢失绑定对象，这个时候它会应用默认绑定，将`this`绑定到全局对象或者`undefined`上。还是刚才的例子

```js
var name = '侯丽谢';
var person = {
  name: '王德发',
  sayHi: function () {
    console.log(this.name);
  },
};
person.sayHi(); //2. 王德发
var fn = person.sayHi;
fn(); // 3. 侯丽谢
/**********************/
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  fn(); // 调用位置
}
var obj = {
  a: 2,
  foo: foo,
};
var a = 'oops, global';
doFoo(obj.foo); //  "oops, global"
```

虽然 fn 是 person.sayHi 的一个引用，但实际上，它引用的是 sayHi 函数本身，因此这个时候 fn()其实是一个不带修饰符的函数调用，故应用默认绑定。第二个例子也一样，主要看 fn 函数是在哪里调用的。

## 4、显式绑定

很简单： **通过 call apply bind 绑定**

> 一句话介绍 call：使用一个指定的 this 和若干个指定的参数调用某个函数或方法。
> 如果 call、apple、bind 的绑定对象是 null 或者 undefined，那么实际上在调用时这些值都会被忽略，所以使用的是默认绑定规则
> 看一下，call 做了那些事情

- 将函数设为对象的属性
- 指定函数的 this，并进行传参
- 执行&删除函数
- 判定如果没有指定要绑定的 this，非严格模式下默认指向全局对象
  ok，这块代码就不放了，手写系列里也有过手写 call

## 5、new 绑定

在`Javascript`中，所谓的构造函数只是一些使用`new`操作符时被调用的函数，并不会属于某个类，也不会实例化一个类，它们只是被`new`调用的普通函数而已。  
看一下 new 做了什么事情

- 创建（或者说构造）一个全新的对象。
- 这个新对象会被执行[[Prototype]]（也就是**proto**）链接。
- 它使 this 指向新创建的对象
- 通过 new 创建的每个对象将最终被[[Prototype]]链接到这个函数的 prototype 对象上
- 如果函数没有返回对象类型 Object(包含 Functoin, Array, Date, RegExg, Error)，那么 new 表达式中的函数调用将返回该对象引用

```js
var name = 'window';
function foo(name) {
  this.name = name;
}
var bar = {
  name: 'bar',
  foo1: new foo('wang'),
};
console.log(bar.foo1.name); // wang
```

## 5、ES6 箭头函数绑定

ES6 新增了一种函数类型：箭头函数，箭头函数调用时无法使用上面四种规则了，它和普通函数最不同的一点就是对于箭头函数的 this 指向，是根据它外层（函数/全局）作用域来决定。（它没有自己的this）  
箭头函数的 this 绑定后无法被改变，箭头函数也不能被 new（做构造函数）

```js
function foo() {
  return name => {
    console.log(this.name);
  };
}
var obj = {
  name: 'obj',
};
var obj1 = {
  name: 'obj1',
};
var name = 'wang';

var foo1 = foo();
foo1(); // wang

var foo2 = foo.call(obj);
foo2(); // obj

foo2.call(obj1); // obj 可以看到，箭头函数的`this`绑定后无法被修改
```

# 规则优先级

```js
1、new绑定
var obj = new Foo();
this绑定新的对象上

2、显示绑定
var obj = foo.call(bar);
this绑定到指定对象上，若指定对象为null/undefined或着没传，则使用默认绑定规则

3、隐式绑定
var obj = bar.foo();
this绑定到调用方法的对象上

4、默认绑定
foo();
this在严格模式下绑定到undefined
在非严格模式下绑定到全局对象
```
