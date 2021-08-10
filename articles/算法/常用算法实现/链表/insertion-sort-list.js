/**
 * https://leetcode-cn.com/problems/insertion-sort-list/
 * 对链表插入排序
 */
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
var insertionSortList = function (head) {
  if (!head) return head;
  var cur = head.next;
  var lastSorted = head; //为链表的已排序部分的最后一个节点，初始时 lastSorted = head。 每次cur的上一个节点
  var dh = new ListNode(-1, head);
  while (cur) {
    if (lastSorted.val <= cur.val) {
      lastSorted = lastSorted.next;
    } else {
      var p1 = dh;
      while (p1.next.val <= cur.val) {
        p1 = p1.next;
      }
      lastSorted.next = cur.next;
      cur.next = p1.next;
      p1.next = cur;
    }
    cur = lastSorted.next;
  }
  return dh.next;
};
