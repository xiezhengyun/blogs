# 2. 两数相加

给你两个   非空 的链表，表示两个非负的整数。它们每位数字都是按照   逆序   的方式存储的，并且每个节点只能存储   一位   数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0  开头。

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

```js
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
var addTwoNumbers = function (l1, l2) {
  var dh = new ListNode(-1);
  var cur = dh;
  var carry = 0;
  while (l1 || l2) {
    var x = l1 ? l1.val : 0;
    var y = l2 ? l2.val : 0;
    var sum = x + y + carry;

    carry = Math.floor(sum / 10); // 进位
    cur.next = new ListNode(Math.floor(sum % 10));
    cur = cur.next;

    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  if (carry) cur.next = new ListNode(carry); //最后要判断下是否还有进位
  return dh.next;
};
```
