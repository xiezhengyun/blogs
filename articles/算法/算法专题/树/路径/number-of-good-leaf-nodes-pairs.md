# 1530. 好叶子节点对的数量

https://leetcode-cn.com/problems/number-of-good-leaf-nodes-pairs/

给你二叉树的根节点 root 和一个整数 distance 。

如果二叉树中两个 叶 节点之间的 最短路径长度 小于或者等于 distance ，那它们就可以构成一组 好叶子节点对 。

返回树中 好叶子节点对的数量 。  

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/07/26/e2.jpg)  

输入：root = [1,2,3,4,5,6,7], distance = 3
输出：2
解释：好叶子节点对为 [4,5] 和 [6,7] ，最短路径长度都是 2 。但是叶子节点对 [4,6] 不满足要求，因为它们之间的最短路径长度为 4 。


- 两个叶子节点的最短路径（距离）可以用其最近的公共祖先来辅助计算。即两个叶子节点的最短路径 = 其中一个叶子节点到最近公共祖先的距离 + 另外一个叶子节点到最近公共祖先的距离。
- 定义 dfs(root)，其功能是计算以 root 作为出发点，到其各个叶子节点的距离。 如果其子节点有 8 个叶子节点，那么就返回一个长度为 8 的数组， 数组每一项的值就是其到对应叶子节点的距离
- 子树的结果计算出来了，那么父节点只需要把子树的每一项加 1 即可。这点不难理解，因为**父到各个叶子节点的距离就是父节点到子节点的距离（1） + 子节点到各个叶子节点的距离**。

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
 * @param {number} distance
 * @return {number}
 */
var countPairs = function (root, distance) {
  var res = 0;
  var dfs = function (root) {
    if (!root) return [];
    if (!root.left && !root.right) return [0]; //叶子节点

    var left = dfs(root.left).map(i => i + 1);
    var right = dfs(root.right).map(i => i + 1);

    for (var i = 0; i < left.length; i++) {
      for (var j = 0; j < right.length; j++) {
        if (left[i] + right[j] <= distance) res++;
      }
    }
    return [...left, ...right];
  };
  dfs(root);
  return res;
};
```
