# 路径总和

给你二叉树的根节点  root 和一个表示目标和的整数  targetSum ，判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和  targetSum 。

叶子节点 是指没有子节点的节点。

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
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  var dfs = function (root, num) {
    if (root.left == null && root.right == null && num == 0) {
      return true;
    }
    if (root.left == null && root.right == null) return false;
    //  左（空节点不遍历）.遇到叶子节点返回true，则直接返回true
    if (root.left && dfs(root.left, num - root.left.val)) return true;
    //  右（空节点不遍历）
    if (root.right && dfs(root.right, num - root.right.val)) return true;
    return false;
  };
  return dfs(root, targetSum - root.val);
};
// 栈
var hasPathSum = function (root, targetSum) {
  if (!root) return false;
  var stack = [[root, root.val]];
  while (stack.length) {
    var [node, num] = stack.pop();

    if (!node.left && !node.right) {
      if (num == targetSum) return true;
      continue;
    }

    node.left && stack.push([node.left, num + node.left.val]);
    node.right && stack.push([node.right, num + node.right.val]);
  }
  return false;
};
```
