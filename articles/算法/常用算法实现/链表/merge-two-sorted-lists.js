/**
 * https://leetcode-cn.com/problems/merge-two-sorted-lists/submissions/
 * 21 合并两个有序链表
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function (l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  var cur = new ListNode(-1, l1); //虚拟节点来处理头部
  while (l2) {
    var a = cur;
    var l2next = l2.next;
    while (a.next) {
      if (a.next.val > l2.val) {
        var next = a.next;
        a.next = l2;
        l2.next = next;
        break;
      } else if (a.next.val <= l2.val && !a.next.next) {
        //这里处理尾部
        a.next.next = l2;
        l2.next = null;
        break;
      } else {
        a = a.next;
      }
    }
    l2 = l2next;
  }
  return cur.next;
};

// 迭代2
var mergeTwoLists = function (l1, l2) {
  var dh = new ListNode(-1);
  var prev = dh;
  while (l1 != null && l2 != null) {
    if (l1.val <= l2.val) {
      prev.next = l1;
      l1 = l1.next;
    } else {
      prev.next = l2;
      l2 = l2.next;
    }
    prev = prev.next;
  }
  prev.next = l1 === null ? l2 : l1;
  return dh.next;
};

//递归
var mergeTwoLists = function (l1, l2) {
  if (l1 === null) return l2;
  if (l2 === null) return l1;
  if (l1.val > l2.val) {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  } else {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  }
};
