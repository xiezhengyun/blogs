# compose
如果有很多个函数，每一个都以前面的返回值作为入参，类似管道一样，可以实现一个compose函数，`compose(fn1,fn2,fn3...)(args)`，得到同样的结果。

```js
var compose = function (...func) {
  var length = func.length;

  return function (...args) {
    var index = 0;
    var res = length ? func[index].call(this, ...args) : args[0];
    while (index < length) {
      res = func[index].call(this, res);
      index++;
    }
    return res;
  };
};

```

