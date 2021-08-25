/** 
 *  https://leetcode-cn.com/problems/middle-of-the-linked-list/submissions/
 * 获取链表中间节点
 * 快慢指针, 
 * 如果链表长度n是偶数, 快指针一开始指向head, 那返回的就是中间节点的后一个, 快指针一开始指向head.next, 返回的就是中间节点的前一个. 
 * n是奇数, 没有影响, 都是返回最中间的节点
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
 var middleNode = function (head) {
  var slow = head;
  var fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next
  }
  return slow
};
