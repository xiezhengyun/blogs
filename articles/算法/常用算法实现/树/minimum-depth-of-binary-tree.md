# 二叉树的最小深度

https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/  
给定一个二叉树，找出其最小深度。

最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

说明：叶子节点是指没有子节点的节点。

```
    1
   / \
  2   2
       \
        3
```

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
 * @return {number}
 */
// BFS
var minDepth = function (root) {
  if (!root) return 0;
  var q = [root];
  var min = 0;
  while (q.length) {
    var len = q.length;
    min++;
    for (var i = 0; i < len; i++) {
      var node = q.shift();
      if (node.left == null && node.right == null) {
        return min;
      }
      node.left && q.push(node.left);
      node.right && q.push(node.right);
    }
  }
  return min;
};
// 递归
var minDepth = function (root) {
  if (!root) return 0;
  // 叶子节点
  if (!root.left && !root.right) return 1;
  // 如果没有左节点，返回右节点
  if (!root.left) return 1 + minDepth(root.right);
  // 如果没有右节点，返回左节点
  if (!root.right) return 1 + minDepth(root.left);

  return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
};
```
