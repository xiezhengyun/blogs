# 16. 最接近的三数之和

给定一个包括  n 个整数的数组  nums  和 一个目标值  target。找出  nums  中的三个整数，使得它们的和与  target  最接近。返回这三个数的和。假定每组输入只存在唯一答案。

```
输入：nums = [-1,2,1,-4], target = 1
输出：2
解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。
```

- 先排序
- 由于是求三数之和，先一个 for，再里面用双指针（左右端点）
- 记录 一个 res，和 i，start 以及 end 组成的和sum比较，更新数据，逼近正确数据
- 返回结果

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function (nums, target) {
  nums.sort((a, b) => a - b);
  //[-3,0,1,2]
  var res = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < nums.length; i++) {
    var start = i + 1,
      end = nums.length - 1;

    while (start < end) {
      var sum = nums[i] + nums[start] + nums[end];

      if (Math.abs(target - sum) < Math.abs(target - res)) res = sum;

      if (sum === target) return sum;
      if (sum < target) {
        start++;
      } else {
        end--;
      }
    }
  }
  return res;
};
```
