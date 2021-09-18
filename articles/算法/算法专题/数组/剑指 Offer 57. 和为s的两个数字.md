# 剑指 Offer 57. 和为 s 的两个数字

输入一个递增排序的数组和一个数字 s，在数组中查找两个数，使得它们的和正好是 s。如果有多对数字的和等于 s，则输出任意一对即可。

```
输入：nums = [2,7,11,15], target = 9
输出：[2,7] 或者 [7,2]
```

- 这题暴力法 O(2n),二分 O(NlogN)，哈希 O(N),但是有额外空间
- 所以用栓指针

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  var l = 0,
    r = nums.length - 1;
  while (l < r) {
    var sum = nums[r] + nums[l];
    if (sum === target) return [nums[l], nums[r]];
    if (sum > target) {
      r--;
    } else {
      l++;
    }
  }
  return [];
};
```
