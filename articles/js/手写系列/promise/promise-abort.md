# 取消 promise

## 借助 Promise.race() 方法

```js
//传入一个正在执行的promise
function getPromiseWithAbort(p) {
  let obj = {};
  //内部定一个新的promise，用来终止执行
  let p1 = new Promise(function (resolve, reject) {
    obj.abort = reject;
  });
  obj.promise = Promise.race([p, p1]);
  return obj;
}

var promise = new Promise(resolve => {
  setTimeout(() => {
    resolve('123');
  }, 3000);
});

var obj = getPromiseWithAbort(promise);

obj.promise.then(res => {
  console.log(res);
});

//如果要取消
obj.abort('取消执行');
```

我理解的是，Promise 本身是不能取消的，这个代码实现的取消只是忽视了原本的 Promise，不 handle 那个 promise 了而已

xhr 本身有提供 abort 方法，fetch 的话就需要用到 AbortController 来取消
