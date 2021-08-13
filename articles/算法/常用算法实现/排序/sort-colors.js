/**
 * https://leetcode-cn.com/problems/sort-colors/solution/
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 * 给定一个包含红色、白色和蓝色，一共 n 个元素的数组，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。 
 * 此题中，我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。
 */
var swap = function (nums, i, j) {
  var temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp
}
// 快速排序
var sortColors = function (nums) {
  // [0, p1) 0
  // [p1, p2) 1
  // [p2, len-1] 2

  // 循环终止条件是 i == p2，那么循环可以继续的条件是 i < p2
  // 为了保证初始化的时候 [0, p1) 为空，设置 p1 = 0，
  // 所以下面遍历到 0 的时候，先交换，再加
  var i = 0
  var p1 = 0;
  // 为了保证初始化的时候 [p2, len - 1] 为空，设置 p2 = len
  // 所以下面遍历到 2 的时候，先减，再交换
  var p2 = nums.length;

  while (i < p2) {
    if (nums[i] == 0) {
      swap(nums, i, p1)
      p1++
      i++
    } else if (nums[i] == 1) {
      i++
    } else if (nums[i] == 2) {
      p2--
      swap(nums, i, p2)
    }
  }

  return nums
};