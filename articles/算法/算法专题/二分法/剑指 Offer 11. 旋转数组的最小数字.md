# 剑指 Offer 11. 旋转数组的最小数字

把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。输入一个递增排序的数组的一个旋转，输出旋转数组的最小元素。  
例如，数组  [3,4,5,1,2] 为 [1,2,3,4,5] 的一个旋转，该数组的最小值为 1。

```
输入：[3,4,5,1,2]
输出：1

输入：[2,2,2,0,1]
输出：0

[3，1，3]
```
- 题目可以看作是2个递增序列，求中间的点。二分法，重要的是分析不同的情况
- numbers[mid] > numbers[r] ，此时间隔点一定在mid右侧，所以 l = mid + 1
- numbers[mid] < numbers[r] ，此时，第一个递增序列已经过了，间隔点有可能就是mid，也有可能在mid左边，所以不能舍弃mid，r = mid
- numbers[mid] = numbers[r] ，此时，不确定间隔点在mid哪边，只能r--
## 二分

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
var minArray = function (numbers) {
  var l = 0,
    r = numbers.length - 1;
  while (l < r) {
    var mid = (l + r) >> 1;
    if (numbers[mid] > numbers[r]) {
      l = mid + 1;
    } else if (numbers[mid] < numbers[r]) {
      r = mid;
    } else {
      r--;
    }
  }
  return numbers[l];
};
```
