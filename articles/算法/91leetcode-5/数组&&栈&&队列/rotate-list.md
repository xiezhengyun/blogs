# 61. 旋转链表
给你一个链表的头节点 head ，旋转链表，将链表每个节点向右移动 k 个位置。 

![](https://assets.leetcode.com/uploads/2020/11/13/rotate1.jpg)  

![](https://assets.leetcode.com/uploads/2020/11/13/roate2.jpg)

## 思路 
因为k可能比链表的长度大，先结成环形链表，再确认走的步数
- k < len 走 len-k
- k >= len 走  len - k%len 取余，计算实际的k，避免多走无效的（这里k === len 可以直接返回head）  

其实这两一样
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function (head, k) {
  if (!head || !head.next || !k) return head

  var cur = head
  var len = 1
  while (head.next) {
    len++
    head = head.next
  }
  head.next = cur

  var move = len - k % len;

  while (move) {
    head = head.next
    move--
  }

  var h = head.next
  head.next = null
  return h
};
```
## 复杂度
N是链表的长度
- 时间复杂度 O(N)
- 空间复杂度 O(1)