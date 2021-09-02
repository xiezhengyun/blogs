# 450. 删除二叉搜索树中的节点

给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的  key  对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。

- 确定递归函数参数以及返回值  
  通过递归返回值删除节点
- 确定终止条件  
  遇到空返回，其实这也说明没找到删除的节点，遍历到空节点直接返回了
- 确定单层递归的逻辑  
  这里一共有 5 种情况
  - 1. 没找到删除的节点，遍历到空节点直接返回了
  - 找到要删除的节点 - 2. 如果该节点的左右节点都为空，直接删除节点，返回 NULL - 3. 该节点左节点为空，删除节点，返回右节点 - 4. 该节点有节点为空，删除节点，返回左节点 - 5. 左右节点都不为空，将左节点挂到右节点的最左节点的左节点上，返回右节点
    ![](https://tva1.sinaimg.cn/large/008eGmZEly1gnbj3k596mg30dq0aigyz.gif)

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
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function (root, key) {
  if (!root) return root;
  if (root.val == key) {
    // 1 左右节点都为空, 删除节点，返回null
    if (!root.left && !root.right) return null;
    // 2 左节点为空，直接返回右节点
    if (!root.left && root.right) return root.right;
    // 3 右节点为空，直接返回左节点
    if (root.left && !root.right) return root.left;
    // 4 左右节点都不为空， 把左节点挂载到右节点的最左节点的左节点, 返回右节点
    var left = root.left;
    var right = root.right;
    var cur = right;
    while (cur.left) {
      cur = cur.left;
    }
    cur.left = left;
    return right;
  }
  if (root.val > key) root.left = deleteNode(root.left, key);
  if (root.val < key) root.right = deleteNode(root.right, key);
  return root;
};
```
