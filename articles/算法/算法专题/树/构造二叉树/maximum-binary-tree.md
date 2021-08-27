# 654. 最大二叉树

https://leetcode-cn.com/problems/maximum-binary-tree/

给定一个不含重复元素的整数数组 nums 。一个以此数组直接递归构建的 最大二叉树 定义如下：

二叉树的根是数组 nums 中的最大元素。
左子树是通过数组中 最大值左边部分 递归构造出的最大二叉树。
右子树是通过数组中 最大值右边部分 递归构造出的最大二叉树。
返回有给定数组 nums 构建的 最大二叉树 。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function (nums) {
  var index = findMax(nums);
  if (index === null) return null;
  var root = new TreeNode(nums[index]);
  var left = nums.slice(0, index);
  var right = nums.slice(index + 1);
  root.left = constructMaximumBinaryTree(left);
  root.right = constructMaximumBinaryTree(right);
  return root;
};

var findMax = function (arr) {
  if (arr.length === 0) return null;
  var maxIndex = 0;
  arr.forEach((item, index) => {
    if (item > arr[maxIndex]) {
      maxIndex = index;
    }
  });
  return maxIndex;
};
```

不开辟数组，用两个指针

```js
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function (nums, min = 0, max = nums.length) {
  if (min == max) return null;

  var index = findMax(nums, min, max);

  var root = new TreeNode(nums[index]);
  root.left = constructMaximumBinaryTree(nums, min, index);
  root.right = constructMaximumBinaryTree(nums, index + 1, max);
  return root;
};

var findMax = function (arr, min, max) {
  var maxIndex = min;
  for (var i = min; i < max; i++) {
    if (arr[i] > arr[maxIndex]) {
      maxIndex = i;
    }
  }
  return maxIndex;
};
```
