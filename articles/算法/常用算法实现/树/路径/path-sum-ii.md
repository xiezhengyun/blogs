# 路径总和 II

https://leetcode-cn.com/problems/path-sum-ii/

给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。

叶子节点 是指没有子节点的节点。

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
 * @param {number} targetSum
 * @return {number[][]}
 */
var pathSum = function (root, targetSum) {
  if (!root) return [];
  var res = [];
  var path = [root.val];
  var dfs = function (root, num) {
    if (root.left == null && root.right == null && num == 0) {
      res.push([...path]); //不能直接push(path)
    }
    if (root.left) {
      path.push(root.left.val);
      dfs(root.left, num - root.left.val);
      path.pop(); //回溯
    }
    if (root.right) {
      path.push(root.right.val);
      dfs(root.right, num - root.right.val);
      path.pop(); //回溯
    }
  };
  dfs(root, targetSum - root.val);
  return res;
};



var pathSum = function (root, target) {
  if (!root) return [];
  var res = [];
  var path = [];
  var dfs = function (node, sum) {
    path.push(node.val);
    sum -= node.val;
    if (!node.left && !node.right && sum == 0) {
      res.push([...path]);
    }
    if (node.left) {
      dfs(node.left, sum);
      path.pop();
    }
    if (node.right) {
      dfs(node.right, sum);
      path.pop();
    }
  };
  dfs(root, target);
  return res;
};
```
