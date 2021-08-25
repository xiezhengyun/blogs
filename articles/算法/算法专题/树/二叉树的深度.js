/**
 * https://leetcode-cn.com/problems/er-cha-shu-de-shen-du-lcof/
 * 二叉树深度
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 *   4
   /   \
  2     7
 / \   / \
1   3 6   9
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
// dfs 深度优先搜索 递归
var maxDepth = function (root) {
  if (!root) return 0
  var L = maxDepth(root.left);
  var R = maxDepth(root.right)
  var res = Math.max(L, R) + 1
  return res
};

// 用栈 迭代dfs遍历二叉树
var maxDepth = function (root) {
  // 模拟函数调用栈 stack 携带上层深度
  if (!root) return 0;

  let max = 0;
  const stack = [[root, 0]];
  while (stack.length) {
    const [node, p] = stack.pop();
    console.log(`node-----`, node, p);

    max = Math.max(max, p + 1);
    console.log(max);

    node.left && stack.push([node.left, p + 1]);
    node.right && stack.push([node.right, p + 1]);
    console.log(stack);
  }

  return max;
};

// 迭代bfs
var maxDepth = function (root) {
  if (!root) return 0;
  var queue = [root];
  var max = 0;
  while (queue.length) {
    var len = queue.length;
    for (var i = 0; i < len; i++) {
      var node = queue.shift();
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
    max++;
  }
  return max;
};
