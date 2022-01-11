function partition(arr, left, right) {
  let p = left;
  let index = p + 1;
  for (let i = index; i <= right; i++) {
    if (arr[i] < arr[p]) {
      [arr[i], arr[index]] = [arr[index], arr[i]];
      index++;
    }
  }
  [arr[p], arr[index - 1]] = [arr[index - 1], arr[p]];
  console.log(JSON.parse(JSON.stringify(arr)).join(), index);
  return index - 1;
}

function quickSort(arr, left, right) {
  var len = arr.length,
    partitionIndex,
    left = typeof left != 'number' ? 0 : left,
    right = typeof right != 'number' ? len - 1 : right;

  if (left < right) {
    partitionIndex = partition(arr, left, right);
    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }
  return arr;
}
console.log(quickSort([-2, 3, 5, 1, -1, 0, 99, -99]));
