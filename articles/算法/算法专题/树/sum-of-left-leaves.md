404. 左叶子之和

https://leetcode-cn.com/problems/sum-of-left-leaves/

计算给定二叉树的所有左叶子之和。

示例：

```
    3
   / \
  9  20
    /  \
   15   7
```

在这个二叉树中，有两个左叶子，分别是 9 和 15，所以返回 24

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
var sumOfLeftLeaves = function (root) {
  var res = 0;
  if (!root) return res;
  var dfs = function (node) {
    if (node.left && !node.left.left && !node.left.right) {
      res += node.left.val;
    }
    node.left && dfs(node.left);
    node.right && dfs(node.right);
  };
  dfs(root);
  return res;
};

//BFS
var sumOfLeftLeaves = function (root) {
  var res = 0
  if (!root) return res
  var q = [root]
  while (q.length) {
    var node = q.shift()
    if (node.left && !node.left.left && !node.left.right) {
      res += node.left.val
    }
    node.left && q.push(node.left)
    node.right && q.push(node.right)
  }
  return res
}
```
