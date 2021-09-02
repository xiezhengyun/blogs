# 108. 将有序数组转换为二叉搜索树

给你一个整数数组 nums ，其中元素已经按 升序 排列，请你将其转换为一棵 高度平衡 二叉搜索树。

高度平衡 二叉树是一棵满足「每个节点的左右两个子树的高度差的绝对值不超过 1 」的二叉树。

- 去数组的中间节点，当此二叉树的中间节点。
- 分割数组，左节点再取左数组中间节点，右节点再取右数组的中间节点
- 递归

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
var sortedArrayToBST = function (nums) {
  var buildTree = function (nums, left, right) {
    if (left > right) return null;

    var mid = Math.ceil((left + right) / 2);
    var node = new TreeNode(nums[mid]);

    node.left = buildTree(nums, left, mid - 1);
    node.right = buildTree(nums, mid + 1, right);

    return node;
  };
  return buildTree(nums, 0, nums.length - 1);
};
```
