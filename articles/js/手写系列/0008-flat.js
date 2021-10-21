function flat(arr, depth = 1) {
  return depth > 0
    ? arr.reduce((pre, cur) => {
        console.log(pre, cur);
        return pre.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur);
      }, [])
    : arr.slice();
}

console.log(flat([['first']], 3));

function* flat(arr, depth = 1) {
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      // depth > 0
      yield* flat(item, depth - 1);
    } else {
      yield item;
    }
  }
}
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, 'string', { name: '12121' }];

console.log([...flat(arr, Infinity)]);

Array.prototype.flat2 = function (depth = 1) {
  let newArr = [...this];
  while (depth--) {
    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i] instanceof Array) {
        newArr.splice(i, 1, ...newArr[i]);
      }
    }
  }
  return newArr;
};
