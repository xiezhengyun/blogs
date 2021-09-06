# 114. 二叉树展开为链表

给你二叉树的根结点 root ，请你将它展开为一个单链表：

展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
展开后的单链表应该与二叉树 先序遍历 顺序相同。
![](https://assets.leetcode.com/uploads/2021/01/14/flaten.jpg)

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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function (root) {
  while (root) {
    if (root.left) {
      var pre = root.left;
      // 找到 原 左节点的 最右节点
      while (pre.right) {
        pre = pre.right;
      }
      // 把 原 右节点挂到 原 左节点 的 最 右节点
      pre.right = root.right;
      // 把右节点换成左节点
      root.right = root.left;
      root.left = null;
    }
    root = root.right;
  }
};
```
