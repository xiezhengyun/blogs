
# 232. 用栈实现队列
- void push(int x) 将元素 x 推到队列的末尾
- int pop() 从队列的开头移除并返回元素
- int peek() 返回队列开头的元素
- boolean empty() 如果队列为空，返回 true ；否则，返回 false

- 你只能使用标准的栈操作 —— 也就是只有 push to top, peek/pop from top, size, 和 is empty 操作是合法的。
- 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。


## 思路
- 队列是先进先出，栈是后进先出，所以得有2个栈来实现队列
- 一个输入栈，一个输出栈。
- pop 和 peek 操作的时候，得把输入栈的元素全部移入输出栈，然后从输出栈输出（保证输出栈的栈顶是最后进的元素）

```js
/**
 * Initialize your data structure here.
 */
var MyQueue = function () {
  this.stackIn = []
  this.stackOut = []
};

/**
 * Push element x to the back of queue. 
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function (x) {
  this.stackIn.push(x)
};

MyQueue.prototype.setStackOut = function(){
  if (this.stackOut.length === 0) {
    while (this.stackIn.length) {
      var item = this.stackIn.pop()
      this.stackOut.push(item)
    }
  }
}
/**
 * Removes the element from in front of queue and returns that element.
 * @return {number}
 */
MyQueue.prototype.pop = function () {
  this.setStackOut()
  return this.stackOut.pop()
};

/**
 * Get the front element.
 * @return {number}
 */
MyQueue.prototype.peek = function () {
  this.setStackOut()
  var item = this.stackOut.pop()
  this.stackOut.push(item)
  return item
};

/**
 * Returns whether the queue is empty.
 * @return {boolean}
 */
MyQueue.prototype.empty = function () {
  return this.stackOut.length === 0 && this.stackIn.length === 0
};

```
## 复杂度分析
### push
- 时间复杂度 O(1)
- 空间复杂度 O(n)
### pop
- 时间 最坏情况下 O(n)
- 空间 O(1)
### peek
- 时间 最坏情况下 O(n)
- 空间 O(1)
### empty 
- 时间 O(1)
- 空间 O(1)