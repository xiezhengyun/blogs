function flat(arr, depth = 1) {
  return depth > 0
    ? arr.reduce((pre, cur) => {
        console.log(pre, cur);
        return pre.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur);
      }, [])
    : arr.slice();
}

function flat(arr, depth = 1) {
  if (depth === 0) {
    return arr.slice();
  }
  
  let result = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flat(arr[i], depth - 1));
    } else {
      result.push(arr[i]);
    }
  }
  
  return result;
}

console.log(flat([['first']], 3));

// 栈
function flat(arr, depth = 1) {
  const result = [];
  const stack = [];

  // for(let i in arr) stack.push([arr[i], depth])
  stack = arr.map(item => [item, depth]);
  while (stack.length > 0) {
    const [top, depth] = stack.pop() || [];
    if (Array.isArray(top) && depth > 0) {
      top.forEach(item => stack.push([item, depth - 1]));
    } else {
      result.push(top);
    }
  }
  return result.reverse();
}
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, 'string', { name: '12121' }];

flat(arr);

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
