// 82 https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/submissions/\\


// 存在一个按升序排列的链表，给你这个链表的头节点 head ，请你删除所有重复的元素，使每个元素 只出现一次 。返回同样按升序排列的结果链表。


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
 var deleteDuplicates = function(head) {
  if (!head) return head
  var cur = head;
  while (head.next !== null) {
    var next = head.next;
    if (head.val === next.val) {
      head.next = next.next;
    } else {
      head = head.next
    }
  }
  return cur
};