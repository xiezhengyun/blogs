# call

call 的 定义： call() 方法在使用一个指定的 this 值和若干个指定的参数值, 调用某个函数或方法。

```js
var foo = {
  value: 1,
};

function bar() {
  console.log(this.value);
}
bar.call(foo); // 1
```

在该例子中可以看到 bar 函数执行了，并且 bar 的 this 值改变了。就类似于

```js
var foo = {
  value: 1,
  bar: function () {
    console.log(this.value);
  },
};

foo.bar(); // 1
```

- 将函数设置为对象的属性
- 执行这个函数(考虑到传参数)
- 复原对象

```JS
Function.prototype.call2 = function(context){
  context.fn = this; //通过this获取 调用call的函数
  context.fn()
  delete context.fn
}
```

- 传参
- this 参数不传时候，指向 window
- 返回值

```js
Function.prototype.call2 = function (context) {
  var context = context || window;
  // 这里context可能存在了一个fn，不过就先这样
  context.fn = this;

  //这里拼接参数，可以用 解构
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  // 在eval中，args 自动调用 args.toString()方法，
  // var result = context.fn(arguments[1], arguments[2], ...);
  var result = eval('context.fn(' + args + ')');

  delete context.fn;
  return result;
};
// 参数解构版本
Function.prototype.call3 = function (context, ...args) {
  var context = context || window;
  // 这里context可能存在了一个fn，不过就先这样
  var fn = Symbol();
  context[fn] = this;
  // 参数
  var result = context[fn](...args)

  delete contex[fn];
  return result;
};
```

```js
Function.prototype.apply2 = function (ctx, arr) {
  // 在浏览器中需要指定为 window，在 node 环境中，则为 空对象
  ctx = ctx || window;
  ctx.func = this;

  let result;
  if (arr) {
    result = ctx.func(arr);
  } else {
    result = ctx.func();
  }

  delete ctx.func;
  return result;
};
```
