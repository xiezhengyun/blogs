# 求和路径

给定一棵二叉树，其中每个节点都含有一个整数数值(该值或正或负)。设计一个算法，打印节点数值总和等于某个给定值的所有路径的数量。注意，路径不一定非得从二叉树的根节点或叶节点开始或结束，但是其方向必须向下(只能从父节点指向子节点方向)。

示例:
给定如下二叉树，以及目标和  sum = 22，

```
              5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
```

返回: 3
解释：和为 22  的路径有：[5,4,11,2], [5,8,4,5], [4,11,7]  

- 深度优先遍历，遍历的时候，以每一个正在遍历的结点作为我们目标求和的根
- 进入求和find的函数，这个函数也是一个深度优先的算法
- 不断地计算从目前这个“根部”（这个是指上面遍历的新根）到现在这个节点地求和，一旦等于我们的目标值sum，就可以计数
- 题目说节点的数值或正或负，这样就不能剪枝了，只能一直遍历到叶子才能停下，因为负数的存在
```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} sum
 * @return {number}
 */
//双递归
var pathSum = function (root, sum) {
  var res = 0;
  var dfs = function (root) { //深度优先搜索，同时检测以这些节点作为根会不会存在目标和
    if (!root) return;
    find(root, 0);
    dfs(root.left);
    dfs(root.right);
  };
  var find = function (root, total) { //题目表示节点的数或正或负，就只能探查到叶子节点了，无法剪枝
    total += root.val;
    if (total === sum) {
      res++;
    }
    root.left && find(root.left, total);
    root.right && find(root.right, total);
  };
  dfs(root);
  return res;
};
```
