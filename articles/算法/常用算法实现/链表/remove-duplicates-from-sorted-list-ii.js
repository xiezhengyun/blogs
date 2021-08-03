//https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list-ii/submissions/

// 存在一个按升序排列的链表，给你这个链表的头节点 head ，请你删除链表中所有存在数字重复情况的节点，只保留原始链表中 没有重复出现 的数字。 返回同样按升序排列的结果链表。

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
var deleteDuplicates = function (head) {
  var dh = new ListNode(0, head);
  var pre = dh;
  while (pre.next && pre.next.next) {
    if (pre.next.val === pre.next.next.val) {
      var value = pre.next.val;
      while (pre.next && pre.next.val === value) {
        pre.next = pre.next.next;
      }
    } else {
      pre = pre.next;
    }
  }
  return dh.next
};
// 递归
var deleteDuplicates = function (head) {
  if (!head || !head.next) return head
  if (head.val === head.next.val) {
    var cur = head.next;
    while (cur && head.val == cur.val) {
      cur = cur.next
    }
    console.log(deleteDuplicates(cur))
    return deleteDuplicates(cur)
  } else {
    head.next = deleteDuplicates(head.next)
  }
  return head
}