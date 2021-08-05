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
