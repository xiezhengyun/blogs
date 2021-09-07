# 687. 最长同值路径

https://leetcode-cn.com/problems/longest-univalue-path/  
给定一个二叉树，找到最长的路径，这个路径中的每个节点具有相同值。 这条路径可以经过也可以不经过根节点。

注意：两个节点之间的路径长度由它们之间的边数表示。

示例 1:

输入:

```
        5
        / \
      4   5
      / \   \
    1   1   5
```

输出: 2

- 递归 求一个子树可以向父节点提供的路径长度
- 对于当前节点，左子树提供的长度left，如果左子树和根节点值一样，left + 1，否则为0
- 对于当前节点，右子树提供的长度right，如果右子树和根节点值一样，right + 1， 否则为0
- 更新最大值
- 当前子树对父节点提供的最大长度为左右链中较大的一个

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
 * @return {number}
 */
var longestUnivaluePath = function (root) {
  var res = 0;
  var dfs = function (root) {
    if (!root) return 0;

    var left = dfs(root.left);
    var right = dfs(root.right);
    //两个节点之间只有满足val相等时才能算作有效边，否则会破坏整条路径，需赋值为0
    var leftPath = 0,
      rightPath = 0;

    if (root.left && root.left.val === root.val) leftPath = left + 1;
    if (root.right && root.right.val === root.val) rightPath = right + 1;

    res = Math.max(res, leftPath + rightPath);
    // 当前节点为路径中间节点，所以只取左右两边最大长度
    return Math.max(leftPath, rightPath);
  };
  dfs(root);
  return res;
};
```
