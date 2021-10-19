Promise.all2 = function (promises) {
  let result = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((p, index) => {
      // 兼容不是promise的情况
      Promise.resolve(p)
        .then(res => {
          result[index] = res;
          count++;
          if (count === promises.length) {
            resolve(result);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};
