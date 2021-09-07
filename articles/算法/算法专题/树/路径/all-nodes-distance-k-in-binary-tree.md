# 863. 二叉树中所有距离为 K 的结点

给定一个二叉树（具有根结点  root），  一个目标结点  target ，和一个整数值 K 。

返回到目标结点 target 距离为 K 的所有结点的值的列表。 答案可以以任何顺序返回。

- target 节点的子节点好找 dfs
- 需要向上寻找，父节点
- 用一个 map 记住所有节点的父节点
- 最后寻找的时候，加入 dfs，但是要判断是否已经遍历过

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
 * @param {TreeNode} target
 * @param {number} k
 * @return {number[]}
 */
var distanceK = function (root, target, k) {
  var parents = new Map();
  var res = [];

  var findParents = function (node) {
    if (node.left) {
      parents.set(node.left.val, node);
      findParents(node.left);
    }
    if (node.right) {
      parents.set(node.right.val, node);
      findParents(node.right);
    }
  };
  // 找到每个节点的父节点
  findParents(root);

  var find = function (node, from, i, k) {
    if (!node) return;

    if (i == k) {
      res.push(node.val);
      return;
    }
    // 遍历右节点
    if (node.right !== from) {
      find(node.right, node, i + 1, k);
    }
    // 遍历右节点
    if (node.left !== from) {
      find(node.left, node, i + 1, k);
    }
    // 父节点
    if (parents.get(node.val) !== from) {
      find(parents.get(node.val), node, i + 1, k);
    }
  };
  // 从 target 出发 DFS，寻找所有深度为 k 的结点
  find(target, null, 0, k);
  return res;
};
```
