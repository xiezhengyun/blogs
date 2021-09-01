# 235. 二叉搜索树的最近公共祖先

给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

在遍历二叉搜索树的时候就是寻找区间[p.val, q.val]（注意这里是左闭又闭）
- 根据二叉搜索树性质：如果 p.val 和 q.val 都比 root.val 小，则 p、q 肯定在 root 的左子树。
- 那问题规模就变小了，递归左子树就行！
- 如果 p.val 和 q.val 都比 root.val 大，递归右子树就行！
- 其他情况，root 即为所求！那么简单吗？为什么？
只要不是 p.val 和 q.val 都大于(小于) root.val，即只要 p, q 不同处在 root 的一个子树
就只有这三种情况：

 - p 和 q 分居 root 的左、右子树。
 - root 就是 p，q 在 p 的子树中。
 - root 就是 q，p 在 q 的子树中

而这三种情况，p 和 q 的最近公共祖先都是 root！是不是很简单！

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  if (!root) return root;

  if (root.val > p.val && root.val > q.val) {
    var left = lowestCommonAncestor(root.left, p, q);
    if (left) return left;
  }

  if (root.val < p.val && root.val < q.val) {
    var right = lowestCommonAncestor(root.right, p, q);
    if (right) return right;
  }
  return root;
};
```

```js
var lowestCommonAncestor = (root, p, q) => {
  while (root) {
    if (p.val < root.val && q.val < root.val) {
      root = root.left;
    } else if (p.val > root.val && q.val > root.val) {
      root = root.right;
    } else {
      break;
    }
  }
  return root;
};
```
