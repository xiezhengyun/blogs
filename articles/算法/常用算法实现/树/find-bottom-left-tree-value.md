# 513. 找树左下角的值

给定一个二叉树的 根节点 root，请找出该二叉树的 最底层 最左边 节点的值。

假设二叉树中至少有一个节点。

```
     4
   /   \
       7
      / \
     6   9
输出6
```

```
     4
   /   \
  2     7
 /
1
输出1
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
/**
 * @param {TreeNode} root
 * @return {number}
 */
// BFS 找到每一层最左边的元素，很简单
var findBottomLeftValue = function (root) {
  if (!root) return;
  var res;
  var q = [root];
  while (q.length) {
    var len = q.length;
    for (var i = 0; i < len; i++) {
      var node = q.shift();
      if (i == 0) res = node.val;

      node.left && q.push(node.left);
      node.right && q.push(node.right);
    }
  }
  return res;
};
// DFS 记录一个最大深度
var findBottomLeftValue = function (root) {
  var maxLen = -1;
  var res;
  if (!root) return;
  var dfs = function (node, len) {
    if (!node.left && !node.right) {
      if (len > maxLen) {
        maxLen = len;
        res = node.val;
      }
    }
    if (node.left) {
      len++
      dfs(node.left, len); //这里有回溯
      len--
    }
    if (node.right) {
      dfs(node.right, len + 1);
    }
  };
  dfs(root, 0);
  return res;
};
```
