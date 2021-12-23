# 柯里化

currying 又称部分求值。一个 currying 的函数首先会接受一些参数，接受了这些参数之后，
**该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保 存起来。**待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值

```js
var add = function (x) {
  return function (y) {
    return x + y;
  };
};
var increment = add(1);
var addTen = add(10);

increment(2); // 3
addTen(2); // 12
```

# 反柯里化

反柯里化的作用在与扩大函数的适用性，使本来作为特定对象所拥有的功能的函数可以被任意对象所用.

uncurryinging反柯里化，使得原来 x.y(z) 调用，可以转成 y(x',z) 形式的调用 。 假设x' 为x或者其他对象，这就扩大了函数的使用范围。

```js
obj.func(arg1, arg2);
// 转化成一个函数形式，签名如下：
func(obj, arg1, arg2);
```

先看一个例子:

```js
(function () {
  Array.prototype.push.call(arguments, 4);
  // arguments 借用 Array.prototype.push 方法 console.log( arguments ); // 输出：[1, 2, 3, 4]
  console.log(arguments);
})(1, 2, 3);
```

这块代码很好理解, arguments 借用 Array.prototype.push 方法 , 给自己 push 了 4

用反柯里化改造一下:

```js
//在Function原型上 绑定一个 currying
Function.prototype.uncurrying = function () {
  var self = this;
  return function () {
    var obj = Array.prototype.shift.call(arguments);
    return self.apply(obj, arguments);
  };
};

var push = Array.prototype.push.uncurrying();
(function () {
  push(arguments, 4);
  console.log(arguments);
  // 输出：[1, 2, 3, 4]
})(1, 2, 3);
```

通过 uncurrying 的方式，Array.prototype.push.call 变成了一个通用的 push 函数, 这里的 `uncurrying` 相当于取出了 push 函数,
让 下面代码的调用变得更加直观. 下面以这个例子 看一下, `uncurrying` 函数中做了什么

```js
Function.prototype.uncurrying = function () {
  var self = this; // 保存住 this 也就是 push 函数
  return function () {
    // arguments
    // 0: Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
    // 1: 4
    var obj = Array.prototype.shift.call(arguments); // 切出 return 匿名函数的  arguments 的第一个参数, 就是 例子函数的 argumentsB 1, 2, 3
    return self.apply(obj, arguments); // argumentsB 调用 apply ,在 1,2,3 后面添加一个4
  };
};
```

还可以再改进下:

```js
for (var i = 0, fn, ary = ['push', 'shift', 'forEach']; (fn = ary[i++]); ) {
  Array[fn] = Array.prototype[fn].uncurrying();
}
var obj = { length: 3, '0': 1, '1': 2, '2': 3 };
Array.push(obj, 4);
console.log(obj);
// 向对象中添加一个元素
```
