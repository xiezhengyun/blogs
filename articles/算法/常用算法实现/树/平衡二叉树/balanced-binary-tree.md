# 平衡二叉树

给定一个二叉树，判断它是否是高度平衡的二叉树。

本题中，一棵高度平衡二叉树定义为：

一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1 。

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
 * @return {boolean}
 */
//求深度适合用前序遍历，而求高度适合用后序遍历。
var isBalanced = function (root) {
  if (!root) return true;
  var getDepth = function (root) {
    console.log(root);
    if (!root) return 0;
    
    var leftDepth = getDepth(root.left); //左
    if (leftDepth === -1) return -1;
    var rightDepth = getDepth(root.right); //右
    if (rightDepth === -1) return -1;

    console.log(`rot======`, leftDepth, rightDepth, 1 + Math.max(leftDepth, rightDepth));

    return Math.abs(leftDepth - rightDepth) > 1 ? -1 : 1 + Math.max(leftDepth, rightDepth); //中
  };
  return getDepth(root) !== -1;
};
```
