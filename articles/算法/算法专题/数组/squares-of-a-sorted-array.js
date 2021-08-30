/* 977. 有序数组的平方
 * https://leetcode-cn.com/problems/squares-of-a-sorted-array/
 * 给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。
 * 
 * 
 * 输入：nums = [-4,-1,0,3,10]
   输出：[0,1,9,16,100]
   解释：平方后，数组变为 [16,1,0,9,100]
   排序后，数组变为 [0,1,9,16,100]
*/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
// 双指针
var sortedSquares = function (nums) {
  var arr = [];
  var write = nums.length - 1;
  var left = 0;
  var right = nums.length - 1;
  // 元素的平方最大值一定产生在原数组的最左边或者最右边。
  // 每次比较下，从大到小直接填入新数组
  while (left <= right) {
    if (nums[left] * nums[left] > nums[right] * nums[right]) {
      arr[write] = nums[left] * nums[left];
      left++;
    } else {
      arr[write] = nums[right] * nums[right];
      right--;
    }
    write--;
  }
  return arr;
};
