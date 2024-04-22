Promise.prototype.race = function (promises) {
  return new Promise((resolve, reject) => {
    if (!promises || !Array.isArray(promises)) {
      return reject(new TypeError('arguments must be an array'));
    }
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(function(value) {
        return resolve(value)
      }, function(reason) {
        return reject(reason)
      })
    }
  });
}
