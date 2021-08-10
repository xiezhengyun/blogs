# 翻转二叉树

https://leetcode-cn.com/problems/invert-binary-tree/

```
翻转一棵二叉树。

示例：

输入：

     4
   /   \
  2     7
 / \   / \
1   3 6   9
输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1

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
var swap = function (root) {
  var left = root.left;
  root.left = root.right;
  root.right = left
}
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function (root) {
  if (!root) return root
  swap(root)
  invertTree(root.left)
  invertTree(root.right)
  return root
};

// 栈 迭代
var invertTree = function (root) {
  if (!root) return root
  var stack = [root]
  while (stack.length) {
    var node = stack.pop();
    swap(node)
    node.left && stack.push(node.left)
    node.right && stack.push(node.right)
  }
  return root
}
```
