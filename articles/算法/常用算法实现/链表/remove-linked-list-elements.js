/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
// 普通删除,要考虑头部节点
var removeElements = function (head, val) {
  if (head == null) return head;
  if (head.val === val) {
    head = head.next;
    return removeElements(head, val);
  }
  let cur = head;
  while (cur.next != null) {
    if (cur.next.val == val) {
      cur.next = cur.next.next;
    } else {
      cur = cur.next;
    }
  }
  return head;
};

// 虚拟节点，虚拟一个头部节点, 不必考虑头部节点
var removeElements = function (head, val) {
  const dummyHead = new ListNode(0);
  dummyHead.next = head;
  let cur = dummyHead;
  while (cur.next != null) {
    if (cur.next.val == val) {
      cur.next = cur.next.next;
    } else {
      cur = cur.next;
    }
  }
  return dummyHead.next;
};
