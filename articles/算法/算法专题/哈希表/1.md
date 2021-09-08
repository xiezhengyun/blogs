# 454. 四数相加 II

给定四个包含整数的数组列表  A , B , C , D ,计算有多少个元组 (i, j, k, l) ，使得  A[i] + B[j] + C[k] + D[l] = 0。

```
输入:
A = [ 1, 2]
B = [-2,-1]
C = [-1, 2]
D = [ 0, 2]

输出:
2

解释:
两个元组如下:
1. (0, 0, 0, 1) -> A[0] + B[0] + C[0] + D[1] = 1 + (-2) + (-1) + 2 = 0
2. (1, 1, 0, 0) -> A[1] + B[1] + C[0] + D[0] = 2 + (-1) + (-1) + 0 = 0

```
- 这题用哈希表，将时间复杂度控制在O(n^2)
- 记住两个数组的任意值之间的和，以及这个和出现的次数
- 遍历另外两个数组，判断这个 和 与 0 的差值有没有在map里出现过，并加上出现过的次数
```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number[]} nums3
 * @param {number[]} nums4
 * @return {number}
 */
var fourSumCount = function (nums1, nums2, nums3, nums4) {
  var towSumMap = new Map();
  var count = 0;
  for (var i of nums1) {
    for (var j of nums2) {
      var sum = i + j;
      towSumMap.set(sum, (towSumMap.get(sum) || 0) + 1); //记住和，以及这个和出现的次数
    }
  }

  for (var k of nums3) {
    for (var l of nums4) {
      var sum = k + l;
      count += towSumMap.get(0 - sum) || 0; //判断这个和 与 0 的差值有没有在map里出现过，并加上出现过的次数
    }
  }
  return count;
};
```
