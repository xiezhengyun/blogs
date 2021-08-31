# 236. 二叉树的最近公共祖先

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

## 公共祖先

- p 和 q 在 root 的子树中，且分列 root 的 异侧（即分别在左、右子树中）；
- p = root ，且 q 在 root 的左或右子树中；
- q = root ，且 p 在 root 的左或右子树中；

## 递归终止条件

1. 当越过叶子节点，直接返回 null
2. 当 root 等于 p、q，直接返回 root

## 返回值

根据 left 和 right 可以有四种情况、

1. left 和 right 同时为空：说明 root 的左/右子树都不包含 p q，返回 null
2. left 和 right 同时不为空：说明 p q 分列在 root 的左右子树，此时 root 是最近公共祖先
3. 当 left 为空，right 不为空，p q 都不在 root 的左子树，此时返回 right
4. 当 left 不为空，right 为空，p q 都不在 root 的右子树，此时返回 left

第一种情况被包含在3，4两种情况中

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  if (root === null || root === p || root === q) return root;

  var left = lowestCommonAncestor(root.left, p, q);
  var right = lowestCommonAncestor(root.right, p, q);

  if (left && right) return root;
  if (!left) return right;
  if (!right) return left;
};
```
1. 求最小公共祖先，需要从底向上遍历，那么二叉树，只能通过后序遍历（即：回溯）实现从低向上的遍历方式。
2. 在回溯的过程中，必然要遍历整颗二叉树，即使已经找到结果了，依然要把其他节点遍历完，因为要使用递归函数的返回值（也就是代码中的left和right）做逻辑判断。
3. 要理解如果返回值left为空，right不为空为什么要返回right，为什么可以用返回right传给上一层结果。