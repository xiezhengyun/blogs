// 206，141，21，19，876

// 206 反转链表  https://leetcode-cn.com/problems/reverse-linked-list/

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  var next;
  var cur = head;
  var pre = null;
  while (cur) {
    next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
};

// 如果是前序遍历，那么你可以想象前面的链表都处理好了，怎么处理的不用管。相应地如果是后序遍历，那么你可以想象后面的链表都处理好了，怎么处理的不用管。

// 递归 前序遍历 （先处理当前节点再处理子节点，那么就是前序）
var reverseList = function (head, prev = null) {
  if (head === null) return prev;
  var next = head.next;
  head.next = prev;
  return reverseList(next, head);
};

//递归 后序遍历
var reverseList = function (head) {
  if (head === null || head.next === null) return head;
  var res = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return res;
};
