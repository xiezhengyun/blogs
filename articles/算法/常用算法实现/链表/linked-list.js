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
  return pre
};
