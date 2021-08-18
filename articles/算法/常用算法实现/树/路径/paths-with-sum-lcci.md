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
- 进入求和 find 的函数，这个函数也是一个深度优先的算法
- 不断地计算从目前这个“根部”（这个是指上面遍历的新根）到现在这个节点地求和，一旦等于我们的目标值 sum，就可以计数
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
  var dfs = function (root) {
    //深度优先搜索，同时检测以这些节点作为根会不会存在目标和
    if (!root) return;
    find(root, 0);
    dfs(root.left);
    dfs(root.right);
  };
  var find = function (root, total) {
    //题目表示节点的数或正或负，就只能探查到叶子节点了，无法剪枝
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

前序递归，记录路径和路径数组，遍历当前路径，判断路径上是否存在满足路径和为 sum 的路径，存在则结果 +1,递归完毕当前节点后，记得把路径数组和路径和还原（回溯）

437. 路径总和 III, 同样可使用下面这种解法
https://leetcode-cn.com/problems/path-sum-iii/submissions/

```js
var pathSum = function (root, sum) {
  if (root === null) {
    return 0;
  }
  let result = 0; // 路径和为 sum 的路径数量
  let pathNum = 0; // 当前递归到的节点的路径和
  let pathArray = []; // 当前递归到的节点的路径数组
  var dfs = function (node) {
    pathNum = pathNum + node.val; // 路径和 +1
    pathArray.push(node.val); // 记录路径数组
    if (pathNum === sum) {
      // 如果当前路径和等于sum，结果加1
      result++;
    }
    // 继续判断当前路径上是否存在路径和等于sum的路径
    let nowPathNum = pathNum;
    for (let i = 0; i < pathArray.length - 1; i++) {
      // 遍历判断当前路径上是否存在路径，使得路径和为 sum
      nowPathNum = nowPathNum - pathArray[i];
      if (nowPathNum === sum) {
        // 如果有相等的路径和，则结果 +1
        result++;
      }
    }
    node.left && dfs(node.left); // 如果左节点不为空则继续递归左节点
    node.right && dfs(node.right); // 如果右节点不为空则继续递归右节点
    pathNum = pathNum - node.val; // 尝试完毕该节点后还原路径和
    pathArray.pop(); // 尝试完毕该节点后还原路径数组
  };
  dfs(root);
  return result;
};
```
