# 35. 搜索插入位置

给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 O(log n) 的算法。

```js
输入: (nums = [1, 3, 5, 6]), (target = 5);
输出: 2;

输入: (nums = [1, 3, 5, 6]), (target = 2);
输出: 1;

输入: (nums = [1, 3, 5, 6]), (target = 7);
输出: 4;

输入: (nums = [1, 3, 5, 6]), (target = 0);
输出: 0;

输入: (nums = [1]), (target = 0);
输出: 0;
```
- 有序数组查找位置，天然选择二分
- 这题主要是维持一个 循环不变量
- l 和 r都是闭区间，当 l== r，区间[left, right]依然有效
```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
  var l = 0,
    r = nums.length - 1;
  //  当 l== r，区间[left, right]依然有效
  // l 和 r都是闭区间
  // 保证循环不变量
  while (l <= r) {
    var mid = (l + r) >> 1;
    if (nums[mid] == target) return mid;

    if (nums[mid] > target) {
      r = mid - 1; // target 在左边，所以 r = mid +1
    } else {
      l = mid + 1; // target 在右边，所以 l = mid +1
    }
  }

  // 目标值在数组所有元素之前  [0, -1] return r + 1
  // 目标值等于数组中某一个元素  return mid;
  // 目标值插入数组中的位置 [l, r]，return  r + 1
  // 目标值在数组所有元素之后的情况 [l, r]， return r + 1

  return r + 1;
};
```
