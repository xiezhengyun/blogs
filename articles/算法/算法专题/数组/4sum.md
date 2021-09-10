# 18. 四数之和

给你一个由 n 个整数组成的数组  nums ，和一个目标值 target 。请你找出并返回满足下述全部条件且不重复的四元组  [nums[a], nums[b], nums[c], nums[d]] ：

0 <= a, b, c, d < n
a、b、c 和 d 互不相同
nums[a] + nums[b] + nums[c] + nums[d] == target
你可以按 任意顺序 返回答案 。

```
输入：nums = [1,0,-1,0,-2,2], target = 0
输出：[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
  nums.sort((a, b) => a - b);
  var res = [];
  console.log(nums);
  for (let k = 0; k < nums.length; k++) {
    //
    if (k > 0 && nums[k] === nums[k - 1]) {
      continue;
    }
    for (let i = k + 1; i < nums.length; i++) {
      // i 去重
      if (i > k + 1 && nums[i] === nums[i - 1]) {
        continue;
      }

      let left = i + 1;
      let right = nums.length - 1;

      while (left < right) {
        var sum = nums[k] + nums[i] + nums[left] + nums[right];

        if (sum > target) {
          right--;
        } else if (sum < target) {
          left++;
        } else {
          res.push([nums[k], nums[i], nums[left], nums[right]]);
          // 这里要对left，right 去重
          while (nums[right] === nums[right - 1]) right--;
          while (nums[left] === nums[left + 1]) left++;

          left++;
          right--;
        }
      }
    }
  }

  return res;
};
```
