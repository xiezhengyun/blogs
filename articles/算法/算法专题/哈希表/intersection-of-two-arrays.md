# 349. 两个数组的交集

给定两个数组，编写一个函数来计算它们的交集。

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  var res = [];
  for (var i of nums1) {
    for (var j of nums2) {
      if (i === j) {
        res.push(i);
      }
    }
  }
  return [...new Set(res)];
};

var intersection = function (nums1, nums2) {
  // 判断 2 个数组的大小
  if (nums1.length > nums2.length) {
    var _ = nums1;
    nums1 = nums2;
    nums2 = _;
  }

  var set = new Set(nums1);
  var res = [];

  for (var i = 0; i < nums2.length; i++) {
    if (set.has(nums2[i])) res.push(nums2[i]);
  }

  return [...new Set(res)];
};
```
