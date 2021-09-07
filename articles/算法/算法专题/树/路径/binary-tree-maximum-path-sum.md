# 124. 二叉树中的最大路径和

路径 被定义为一条从树中任意节点出发，沿父节点-子节点连接，达到任意节点的序列。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。

路径和 是路径中各节点值的总和。

给你一个二叉树的根节点 root ，返回其 最大路径和 。

输入:

```
         5
        / \
       4   5
      / \   \
     1    1   5
```

输出: 1->4->5->5->5 = 20

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
var maxPathSum = function (root) {
  var max = -Infinity;
  var dfs = function (root) {
    if (!root) return 0;
    var left = dfs(root.left);
    var right = dfs(root.right);
    var nowValue = left + right + root.val; // 当前子树内部的最大路径和

    max = Math.max(max, nowValue);

    var outputMaxSum = root.val + Math.max(left, right); // 当前子树对外提供的最大和

    return outputMaxSum > 0 ? outputMaxSum : 0;
  };
  dfs(root);
  return max;
};
```
