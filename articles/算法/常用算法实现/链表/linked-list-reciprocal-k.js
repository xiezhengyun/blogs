/**
 * https://leetcode-cn.com/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/submissions/
 * 链表中倒数第k个节点
 * 双指针 第一个指针先走k步到,然后 两个指针一起走, 最后先走的指针到头, 另一个指针就是倒数第k个
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
 * @param {number} k
 * @return {ListNode}
 */
var getKthFromEnd = function (head, k) {
  if (head == null) return head;
  var fast = head;
  var slow = head;
  while (k > 0) {
    fast = fast.next;
    k--;
  }
  while (fast) {
    slow = slow.next;
    fast = fast.next;
  }
  return slow;
};
