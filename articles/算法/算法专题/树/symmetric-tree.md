# 对称二叉树

https://leetcode-cn.com/problems/symmetric-tree/

```
给定一个二叉树，检查它是否是镜像对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

    1
   / \
  2   2
 / \ / \
3  4 4  3

但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

    1
   / \
  2   2
   \   \
   3    3
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
 * @return {boolean}
 */
var isSymmetric = function (root) {
  if (!root) return true;
  var dfs = function (p1, p2) {
    if (p1 == null && p2 == null) return true;
    if (p1 == null || p2 == null) return false;
    if (p1.val != p2.val) return false;
    // 要遍历左右两课树的左右节点
    return dfs(p1.left, p2.right) && dfs(p1.right, p2.left);
  };
  return dfs(root.left, root.right);
};

// 用队列
var isSymmetric = function (root) {
  if (!root) return true;
  var q = [root.left, root.right]; //模拟队列
  while (q.length) {
    var p1 = q.shift();
    var p2 = q.shift();
    if (p1 == null && p2 == null) {
      continue;
    }
    if (p1 == null || p2 == null || p1.val != p2.val) {
      return false;
    }
    q.push(p1.left);
    q.push(p2.right);
    q.push(p1.right);
    q.push(p2.left);
  }
  return true;
};
```
