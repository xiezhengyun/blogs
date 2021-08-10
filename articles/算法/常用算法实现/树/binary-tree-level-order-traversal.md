# 二叉树的层序遍历

https://leetcode-cn.com/problems/binary-tree-level-order-traversal/

```
示例：
二叉树：[3,9,20,null,null,15,7],

    3
   / \
  9  20
    /  \
   15   7
返回其层序遍历结果：

[
  [3],
  [9,20],
  [15,7]
]
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
 * @return {number[][]}
 * 层序遍历 
 * 需要借用一个辅助数据结构即队列来实现，队列先进先出，符合一层一层遍历的逻辑。
 * 而用栈先进后出适合模拟深度优先遍历也就是递归的逻辑。
 */

var levelOrder = function (root) {
  if (!root) return [];
  var q = [root]; //模拟队列
  var res = [];
  while (q.length) {
    var len = q.length;
    var val = [];
    for (var i = 0; i < len; i++) {
      var node = q.shift(); // 取出队列的第一个元素
      val.push(node.val);
      node.left && q.push(node.left);
      node.right && q.push(node.right);
    }
    res.push(val);
  }
  return res;
};
```
