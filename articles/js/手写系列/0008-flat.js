function flat(arr, depth = 1) {
  return depth > 0
    ? arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur);
      }, [])
    : arr.slice();
}

console.log(flat([[1], [[1], 2]], 3));
