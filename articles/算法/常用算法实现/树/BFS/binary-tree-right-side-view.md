# 二叉树的右视图

https://leetcode-cn.com/problems/binary-tree-right-side-view/

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
 * @return {number[]}
 */
var rightSideView = function (root) {
  if (!root) return [];
  var res = [];
  var q = [root];
  while (q.length) {
    var len = q.length;
    for (var i = 0; i < len; i++) {
      var node = q.shift();
      if (i === len - 1) res.push(node.val);
      node.left && q.push(node.left);
      node.right && q.push(node.right);
    }
  }
  return res;
};
```
