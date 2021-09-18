# 109. 有序链表转换二叉搜索树
给定一个单链表，其中的元素按升序排序，将其转换为高度平衡的二叉搜索树。

本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。

示例:
```
给定的有序链表： [-10, -3, 0, 5, 9],

一个可能的答案是：[0, -3, 9, -10, null, 5], 它可以表示下面这个高度平衡二叉搜索树：

      0
     / \
   -3   9
   /   /
 -10  5
```
## 思路
- 一看题解才知道，快慢指针找链表中点，我是直接转数组了...   
- 找中点，递归生成树
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function (head) {
  if (!head) return null
  var arr = []
  while (head) {
    arr.push(head.val)
    head = head.next
  }
  
  var buildTree = function (arr, l, r) {
    if (l > r) return null
    var mid = Math.ceil((l + r) / 2)
    var root = new TreeNode(arr[mid])

    root.left = buildTree(arr, l, mid - 1)
    root.right = buildTree(arr, mid + 1, r)

    return root
  }
  return buildTree(arr, 0, arr.length - 1)
};
```
## 复杂度
N是链表长度
- 时间复杂度 O(NlogN) 
- 空间复杂度 O(NlogN)