# 完全二叉树的节点个数

https://leetcode-cn.com/problems/count-complete-tree-nodes/

给你一棵 完全二叉树 的根节点 root ，求出该树的节点个数。

完全二叉树 的定义如下：在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置。若最底层为第 h 层，则该层包含 1~ 2h  个节点。

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
var countNodes = function (root) {
  //递归法计算二叉树节点数
  // 1. 确定递归函数参数
  const getNodeSum = function (node) {
    //2. 确定终止条件
    if (node === null) {
      return 0;
    }
    //3. 确定单层递归逻辑
    let leftNum = getNodeSum(node.left);
    let rightNum = getNodeSum(node.right);
    return leftNum + rightNum + 1;
  };
  return getNodeSum(root);
};
```
