/**
 * https://leetcode-cn.com/problems/palindrome-linked-list/solution/
 * 回文链表
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
 * @return {boolean}
 */
// 空间复杂度O(n)
var isPalindrome = function (head) {
  var arr = [];
  while (head != null) {
    arr.push(head.val);
    head = head.next;
  }
  var i = 0;
  var j = arr.length - 1;
  while (i < j) {
    if (arr[i] != arr[j]) return false;
    i++;
    j--;
  }
  return true;
};

var isPalindrome = function (head) {
  if (head === null) return true;

  var getMiddleNode = function (list) {
    var slow = list;
    var fast = list;
    while (fast.next !== null && fast.next.next !== null) {
      fast = fast.next.next;
      slow = slow.next;
    }
    return slow;
  };
  var reverse = function (list) {
    var head = list;
    var pre = null;
    while (head != null) {
      var next = head.next;
      head.next = pre;
      pre = head;
      head = next;
    }
    return pre;
  };

  // 第一步 快慢指针获取中间节点，把链表分成2段
  var middleNode = getMiddleNode(head);

  // 第二步 反转后一半链表，链表是奇数时，中间节点看成上一半链表的
  var head2 = reverse(middleNode.next);
  console.log(head, head2);
  // 第三步 判断是不是回文链表
  var res = true;
  var p1 = head;
  var p2 = head2;
  while (res && p2) {
    if (p1.val != p2.val) return false;
    p1 = p1.next;
    p2 = p2.next;
  }

  // 第四步 恢复链表
  middleNode.next = reverse(head2);

  // 第五步 返回结果
  return res;
};
