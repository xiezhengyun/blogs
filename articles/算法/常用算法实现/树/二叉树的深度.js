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
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
// dfs 深度优先搜索
var maxDepth = function (root) {
  if (!root) return 0;
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
};

// 用栈
var maxDepth = function (root) {
  // 2. 模拟函数调用栈 stack 携带上层深度
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
