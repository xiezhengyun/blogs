# 414. 第三大的数

给你一个非空数组，返回此数组中 第三大的数 。如果不存在，则返回数组中最大的数。

```
输入：[2, 2, 3, 1]
输出：1
解释：注意，要求返回第三大的数，是指在所有不同数字中排第三大的数。
此例中存在两个值为 2 的数，它们都排第二。在所有不同数字中排第三大的数为 1

输入：[1, 2]
输出：2
解释：第三大的数不存在, 所以返回最大的数 2

输入：[3, 2, 1]
输出：1
解释：第三大的数是 1 。
```

- 用 3 个值来表示
- 三个最大的数不能重复，需要过滤掉重复的值
- 在判断最大值时，从最大值开始比较。替换时，大的数要下降到下的数那个位置
- 最后判断 p2 和 p3 是否存在

```JS
/**
 * @param {number[]} nums
 * @return {number}
 */
var thirdMax = function (nums) {
  var p1 = -Infinity
  var p2 = -Infinity
  var p3 = -Infinity
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == p1 || nums[i] == p2 || nums[i] == p3) continue

    if (nums[i] > p1) {
      [p1, p2, p3] = [nums[i], p1, p2]
    } else if (nums[i] > p2) {
      [p2,p3] = [nums[i],p2]
    } else if (nums[i] > p3) {
      p3 = nums[i]
    }
  }
  if (p3 === -Infinity || p2 === -Infinity) return p1
  
  return p3
};
```
