# 617. 合并二叉树

https://leetcode-cn.com/problems/merge-two-binary-trees/

给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。

你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为  NULL 的节点将直接作为新二叉树的节点。

- root1 为 null，直接返回 root2，不用管 root2 是不是为 null
- root2 为 null，直接返回 root1，不用管 roo1 是不是为 null
- 都不为空，就节点的值相加
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
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {TreeNode}
 */
var mergeTrees = function (root1, root2) {
  if (!root1) return root2;
  if (!root2) return root1;

  root1.val += root2.val;
  root1.left = mergeTrees(root1.left, root2.left);
  root1.right = mergeTrees(root1.right, root2.right);

  return root1;
};
```
