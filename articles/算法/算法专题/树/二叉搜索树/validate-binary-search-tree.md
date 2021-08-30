# 98. 验证二叉搜索树

https://leetcode-cn.com/problems/validate-binary-search-tree/

给定一个二叉树，判断其是否是一个有效的二叉搜索树。

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
 * @return {boolean}
 */
var isValidBST = function (root) {
  var arr = [];
  // 先获取中序遍历结果
  var dfs = function (root) {
    if (!root) return;
    dfs(root.left);
    arr.push(root.val);
    dfs(root.right);
  };
  dfs(root);
  var flag = true;
  for (var i = 0; i < arr.length - 1; i++) {
    if (arr[i] >= arr[i + 1]) {
      flag = false;
    }
  }
  return flag;
};

var isValidBST = function (root) {
  var fn = function (root, min, max) {
    if (!root) return true
    if (root.val <= min || root.val >= max) {
      return false
    }
    return fn(root.left, min, root.val) && fn(root.right, root.val, max)
  }
  return fn(root, -Infinity, +Infinity)
}
```
