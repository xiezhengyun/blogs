# 821. 字符的最短距离

给你一个字符串 s 和一个字符 c ，且 c 是 s 中出现过的字符。

返回一个整数数组 answer ，其中 answer.length == s.length 且 answer[i] 是 s 中从下标 i 到离它 最近 的字符 c 的 距离 。

两个下标  i 和 j 之间的 距离 为 abs(i - j) ，其中 abs 是绝对值函数

```
输入：s = "loveleetcode", c = "e"
输出：[3,2,1,0,1,0,0,1,2,2,1,0]
解释：字符 'e' 出现在下标 3、5、6 和 11 处（下标从 0 开始计数）。
距下标 0 最近的 'e' 出现在下标 3 ，所以距离为 abs(0 - 3) = 3 。
距下标 1 最近的 'e' 出现在下标 3 ，所以距离为 abs(1 - 3) = 2 。
对于下标 4 ，出现在下标 3 和下标 5 处的 'e' 都离它最近，但距离是一样的 abs(4 - 3) == abs(4 - 5) = 1 。
距下标 8 最近的 'e' 出现在下标 6 ，所以距离为 abs(8 - 6) = 2 。
```
# 思路
- 计算字符串 s 中每个字符 向左 或 向右 距离 c 的最近距离;
- 通过两次便利分别找出 向左，向右的距离，取最小值
```js
/**
 * @param {string} s
 * @param {character} c
 * @return {number[]}
 */
var shortestToChar = function (s, c) {
  var res = new Array(s.length - 1);
  //prev 上一个 c 出现的位置
  // i 元素 向左查找， prev初始设为 -10001，因为s.length 最大值为 10000(因为第一个元素如果不是c，那第一个元素距离左边的c距离是无的，用一个极大值来表示)
  // 此时res 存 向左查找遇到 c 的距离
  var prev = -10001;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === c) prev = i;
    res[i] = i - prev;
  }
  // 接着 算出 数组每一位 向右，遇到c 的距离
  // prev = 10001
  // 此时 res[i]，取向左和向右的最小值
  prev = 10001;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === c) prev = i;
    res[i] = Math.min(res[i], prev - i);
  }
  return res;
};
```

# 复杂度
- 时间复杂度 O(N) ,遍历2次数组
- 空间复杂度，除返回的数组外，O(1)