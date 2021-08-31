# 235. 二叉搜索树的最近公共祖先  

给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

在遍历二叉搜索树的时候就是寻找区间[p.val, q.val]（注意这里是左闭又闭）

那么如果 root.val 大于 p.val，同时 root.val 大于q.val，那么就应该向左遍历（说明目标区间在左子树上）。

需要注意的是此时不知道p和q谁大，所以两个都要判断

剩下的情况，就是root节点在区间（p.val <= root.val && root.val <= q.val）或者 （q.val <= root.val && cur.val <= p.val）中，那么cur就是最近公共祖先了，直接返回root
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  if (!root) return root;

  if (root.val > p.val && root.val > q.val) {
    var left = lowestCommonAncestor(root.left, p, q);
    if (left) return left;
  }

  if (root.val < p.val && root.val < q.val) {
    var right = lowestCommonAncestor(root.right, p, q);
    if (right) return right;
  }
  return root;
};
```
