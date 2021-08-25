# 另一棵树的子树

给你两棵二叉树 root 和 subRoot 。检验 root 中是否包含和 subRoot 具有相同结构和节点值的子树。如果存在，返回 true ；否则，返回 false 。

二叉树 tree 的一棵子树包括 tree 的某个节点和这个节点的所有后代节点。tree 也可以看做它自身的一棵子树。

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
 * @param {TreeNode} subRoot
 * @return {boolean}
 */
var isSubtree = function (root, subRoot) {
  
  if (!root && !subRoot) return true;
  if (root == null || subRoot == null) return false;

  var dfs = function (p1, p2) {
    if (p1 == null && p2 == null) return true;
    if (p1 == null || p2 == null) return false;
    if (p1.val != p2.val) return false;
    return dfs(p1.left, p2.left) && dfs(p1.right, p2.right);
  };
  // 两棵树相等 || 左子树 || 右子树
  return dfs(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};
```
