# 1008. 前序遍历构造二叉搜索树

https://leetcode-cn.com/problems/construct-binary-search-tree-from-preorder-traversal/  
返回与给定前序遍历  preorder 相匹配的二叉搜索树（binary search tree）的根结点。

(回想一下，二叉搜索树是二叉树的一种，其每个节点都满足以下规则，对于  node.left  的任何后代，值总 < node.val，而 node.right 的任何后代，值总 > node.val。此外，前序遍历首先显示节点  node 的值，然后遍历 node.left，接着遍历 node.right。）

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
 * @param {number[]} preorder
 * @return {TreeNode}
 */
var bstFromPreorder = function (preorder) {
  // 因为二叉搜索树的中序遍历，是一个有序数组，所以先拿到中序遍历结果
  var preorder2 = preorder.slice(0);
  var inorder = preorder2.sort((a, b) => a - b);
  var buildTree = function (preorder, inorder) {
    if (preorder.length == 0) return null;
    //前序遍历：中左右，第一个即为 根节点
    var node = preorder[0];
    // console.log(node)
    var root = new TreeNode(node);
    var index = inorder.findIndex(item => item === node);

    root.left = buildTree(preorder.slice(1, index + 1), inorder.slice(0, index));
    root.right = buildTree(preorder.slice(index + 1), inorder.slice(index + 1));
    return root;
  };
  return buildTree(preorder, inorder);
};
```
