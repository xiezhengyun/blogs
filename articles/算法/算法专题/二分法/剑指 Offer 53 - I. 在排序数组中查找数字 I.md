# 剑指 Offer 53 - I. 在排序数组中查找数字 I

剑指 Offer 53 - I. 在排序数组中查找数字 I

```
输入: nums = [5,7,7,8,8,10], target = 8
输出: 2
```

- 二分找出等于target的点
- 统计次数
```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  var l = 0, r = nums.length - 1, index = -1, count = 0;
  while (l <= r) {
    var mid = l + r >> 1
    if (nums[mid] === target) {
      index = mid
      count++
      break
    }
    if (nums[mid] > target) {
      r = mid - 1
    } else {
      l = mid + 1
    }
  }

  if (index == -1) return count
  
  var a = index - 1;
  while (nums[a] === target && a >= 0) {
    count++
    a--
  }
  var b = index + 1
  while (nums[b] === target && b < nums.length) {
    count++
    b++
  }
  return count
};
```