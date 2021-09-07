# 242. 有效的字母异位词

给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。

注意：若  s 和 t  中每个字符出现的次数都相同，则称  s 和 t  互为字母异位词


- 使用数组来做哈希的题目，是因为题目都限制了数值的大小。
- 这题直接用 26个英文字母的ASCLL 码
```js
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  if (s.length !== t.length) return false;
  var arr = new Array(26).fill(0);
  var base = 'a'.charCodeAt(); // 97

  for (var i of s) {
    arr[i.charCodeAt() - base]++;
  }

  for (var j of t) {
    if (arr[j.charCodeAt() - base] === 0) return false;
    arr[j.charCodeAt() - base]--;
  }
  return true;
};

var isAnagram = function (s, t) {
  if (s.length !== t.length) return false;
  return [...s].sort().join() === [...t].sort().join();
};
```
