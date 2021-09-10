# 15. 三数之和

给你一个包含 n 个整数的数组  nums，判断  nums  中是否存在三个元素 a，b，c ，使得  a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

```
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
```

- 将 复杂度 O(N^3) 变成 O(n^2)，可用哈希，也可用双指针，难点在去重，双指针去重更清晰
- 先将数组排序
- 遍历数组，i， 定义双指针的区间 left = i+1，right = nums.length - 1,
- 要对 i，left，right 分别去重

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  nums.sort((a, b) => a - b);
  var res = [];
  console.log(nums);
  for (let i = 0; i < nums.length; i++) {
    // 这里 首位 > 0，后面怎么也不会加成 0
    if (nums[i] > 0) {
      continue;
    }
    // i 去重， 第一位要纳入计算，不会漏掉 -1，-1，2这种情况
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      var sum = nums[i] + nums[left] + nums[right];

      if (sum > 0) {
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        res.push([nums[i], nums[left], nums[right]]);
        // 这里要对left，right 去重
        while (nums[right] === nums[right - 1]) right--;
        while (nums[left] === nums[left + 1]) left++;

        left++;
        right--;
      }
    }
  }
  return res;
};
```
