# 543. 二叉树的直径

https://leetcode-cn.com/problems/diameter-of-binary-tree/

给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。  
示例 :
给定二叉树

```
          1
         / \
        2   3
       / \
      4   5
```

返回  3, 它的长度是路径 [4,2,1,3] 或者  [5,2,1,3]。

![](https://pic.leetcode-cn.com/1621740243-LSOaVf-src=http___images.xiaozhuanlan.com_photo_2019_aac0e1692d3c9810c6f4a91863598320.gif&refer=http___images.xiaozhuanlan.gif)
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
var diameterOfBinaryTree = function (root) {
  var res = 0;
  var dfs = function (node) {
    if (!node) return 0;
    var L = dfs(node.left);
    var R = dfs(node.right);
    // 找出每一个节点的 左子树最大深度 + 右子树最大深度 的值，然后不断更新全局变量 res 即可
    res = Math.max(L + R, res);
    return Math.max(L, R) + 1;
  };
  dfs(root);
  return res;
};
```
