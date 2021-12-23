# 分时函数

再开发过程中, 有可能会遇到, 一次行执行很多次任务, 比如 创建 Dom, 请求接口. 写一个函数, 分次执行 .

```js
var timeChunk = function (ary, fn, count = 1, delay = 300) {
  var obj, t;
  var len = ary.length;
  var start = function () {
    for (var i = 0; i < Math.min(count, ary.length); i++) {
      var obj = ary.shift();
      fn(obj);
    }
  };
  return function () {
    t = setInterval(function () {
      if (ary.length === 0) {
        // 如果全部节点都已经被创建好
        return clearInterval(t);
      }
      start();
    }, delay);
  };
};
```
