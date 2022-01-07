
/**
 Promise.prototype.finally() 可以在promise被settle的时候执行一个callback，无论其是被fulfill或是被reject。

传入的callback不接受参数，也即该callback不影响promise链中的value（注意rejection)。
*/

function myFinally(promise, onFinally) {
  return promise.then(
    value => {
      return Promise.resolve(onFinally()).then(() => value);
    },
    reason => {
      return Promise.resolve(onFinally()).then(() => Promise.reject(reason));
    }
  );
}
