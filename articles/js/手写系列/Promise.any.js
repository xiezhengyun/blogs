let arr = [
	Promise.resolve(33), 
	new Promise(resolve => setTimeout(() => resolve(66), 1000)), 
	Promise.reject(new Error('an error'))
];

Promise.any2 = promises => {
  let flag = false;
  let errArr = [];
  promises = Array.from(promises);
  if (promises.length == 0) return Promise.reject('promises.length == 0');
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        data => {
          if (flag) return;
          flag = true;
          resolve(data);
        },
        err => {
          errArr.push(err);
          if (i == promises.length - 1) {
            reject(errArr);
          }
        }
      );
    }
  });
};

Promise.any2(arr).then(
  res => {
    console.log(res);
  },
  err => {
    console.log(err);
  }
);
