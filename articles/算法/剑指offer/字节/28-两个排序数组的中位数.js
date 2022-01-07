/**
 * 
 * 给定两个已排序的整数数组，返回其中位数。

  median([1,2],[3,4,5])
  // 3
  如果共有偶数个数，则返回中位的两个数的平均值。

  median([1,2],[3,4])
  // 2.5
 */


function median(arr1, arr2) {
  var l1 = arr1.length;
  var l2 = arr2.length;
  var med = Math.floor((l1 + l2) / 2);
  let index = 0;
  let i = 0;
  let j = 0;
  var current = 0,
    prev = 0;
  while (index <= med) {
    prev = current;
    if (arr1[i] < arr2[j] || j >= arr2.length) {
      current = arr1[i++];
    } else {
      current = arr2[j++];
    }

    index++;
  }
  return (l1 + l2) % 2 === 0 ? (prev + current) / 2 : current;
}
console.log(median([1,2],[-4,-3,-2]))