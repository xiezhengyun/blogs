# 394. 字符串解码
给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。
```
输入：s = "3[a]2[bc]"
输出："aaabcbc"
输入：s = "3[a2[c]]"
输出："accaccacc"
```

- 因为有嵌套的[]，所以可以用递归或者栈
- 这里用栈来记住 之前算好的 res，还有倍数num

```js
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function (s) {
  var strStack = [];
  var numStack = [];
  var num = '';
  var res = '';
  for (let c of s) {
    if (!isNaN(c)) {
      //是数字
      num += c;
      //1位数以上的数字，不能立即入栈
    } else if (c === '[') {
      //[ 字符串入栈 , 数字也入栈
      strStack.push(res);
      res = '';
      numStack.push(num);
      num = '';
    } else if (c === ']') {
      // 双出栈
      var times = numStack.pop();
      var str = strStack.pop();
      res = str + res.repeat(times);
    } else {
      res += c;
    }
  }
  return res;
};
```

## 复杂度

N 是字符串 s 解码后新字符串的长度，S 是字符串 s 的长度

- 时间复杂度 O(N)
- 空间复杂度 O(S)
