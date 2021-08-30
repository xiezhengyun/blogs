# 501. 二叉搜索树中的众数

https://leetcode-cn.com/problems/find-mode-in-binary-search-tree/

给定一个有相同值的二叉搜索树（BST），找出 BST 中的所有众数（出现频率最高的元素）。

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
// 中序遍历是一个有序数组，在有序数组里判断众数， 加上树的操作就行了，pre记住上一个树的节点
var findMode = function (root) {
  var res = [],
    count = 0, // 统计频率
    maxCount = 1, // 最大频率
    pre = null;
  var dfs = function (node) {
    if (!node) return;
    dfs(node.left);

    if (pre === null) {
      // 第一个节点
      count = 1;
    } else if (pre.val == node.val) {
      // 与前一个节点数值相同
      count++;
    } else {
      // 与前一个节点数值不同
      count = 1;
    }

    pre = node;

    if (count === maxCount) {
      res.push(node.val);
    }

    if (count > maxCount) {
      res = [];
      maxCount = count;
      res.push(node.val);
    }

    dfs(node.right);
  };
  dfs(root);
  return res;
};
```
