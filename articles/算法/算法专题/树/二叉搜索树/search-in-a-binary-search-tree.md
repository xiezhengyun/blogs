# 700. 二叉搜索树中的搜索

https://leetcode-cn.com/problems/search-in-a-binary-search-tree/

给定二叉搜索树（BST）的根节点和一个值。 你需要在 BST 中找到节点值等于给定值的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 NULL。

二叉搜索树有以下性质。

- 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
- 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
- 它的左、右子树也分别为二叉搜索树

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
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function (root, val) {
  if (!root || root.val === val) return root;
  // 利用二叉搜索树的性质, 有方向的去找
  if (root.val > val) return searchBST(root.left, val);
  if (root.val < val) return searchBST(root.right, val);
  return null;
};
```
