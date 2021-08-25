# 二叉树所有路径

给定一个二叉树，返回所有从根节点到叶子节点的路径。

说明: 叶子节点是指没有子节点的节点。

```
输入:

   1
 /   \
2     3
 \
  5

输出: ["1->2->5", "1->3"]

解释: 所有根节点到叶子节点的路径为: 1->2->5, 1->3

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
 * @return {string[]}
 */
var binaryTreePaths = function (root) {
  if (!root) return [];
  var res = [];
  var dfs = function (root, str = '') {
    if (root.left == null && root.right == null) {
      str += root.val;
      res.push(str);
      return;
    }
    str = str + root.val + '->';
    root.left && dfs(root.left, str);
    root.right && dfs(root.right, str);
  };
  dfs(root);
  return res;
};
```
