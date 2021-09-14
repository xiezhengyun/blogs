//https://github.com/leetcode-pp/91alg-1/issues/18#issuecomment-637977959

//https://leetcode-cn.com/problems/design-a-stack-with-increment-operation/


class CustomStack {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.arr = [];
  }

  push(x) {
    if (this.arr.length >= this.maxSize) return;
    this.arr.push(x);
  }

  pop() {
    if (this.arr.length > 0) {
      return this.arr.pop();
    }
    return -1;
  }

  increment(k, val) {
    var min = Math.min(k, this.arr.length);
    for (var i = 0; i < min; i++) {
      this.arr[i] = this.arr[i] + val;
    }
  }
}

/**
 * Your CustomStack object will be instantiated and called as such:
 * var obj = new CustomStack(maxSize)
 * obj.push(x)
 * var param_2 = obj.pop()
 * obj.increment(k,val)
 */
