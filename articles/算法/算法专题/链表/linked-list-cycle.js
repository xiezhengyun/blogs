/*
 * https://leetcode-cn.com/problems/linked-list-cycle/submissions/
 * 141 判断链表是否有环
 * 快慢指针
 * 总结快慢指针的特性 —— 每轮移动之后两者的距离会加一。
 * 当在换里第二次相遇时候, 第一次和第二次的移动间隔就是环的长度
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
  if (head == null || head.next == null) return false;
  var slow = head;
  var fast = head.next;
  while (slow != fast) {
    if (fast == null || fast.next == null) return false;
    slow = slow.next;
    fast = fast.next.next;
  }
  return true;
};

var hasCycle = function (head) {
  if (head == null || head.next == null) return false;
  var slow = head;
  var fast = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
    if (slow == fast) return true;
  }
  return false;
};
