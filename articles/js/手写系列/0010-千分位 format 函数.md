```
// 接收一个number，返回一个string
function format(number) {}
console.log(format(12345.789)); // 12,345.789,0
console.log(format(0.12345678)); // 0.123,456,78
console.log(format(123456)); // 123,456
```

- 基于小数点切分，对于整数部分，从后往前遍历，隔 3 加 ,
- 小数点部分，从前往后便利，隔 3 加,

```js
function format(number) {
  let str = number.toString();
  let [int, dec = ''] = str.split('.');
  
  let intStr = '';
  for (let i = int.length - 1; i >= 0; i--) {
    if ((int.length - i) % 3 === 0 && i !== 0) {
      intStr = ',' + int[i] + intStr;
    } else {
      intStr = int[i] + intStr;
    }
  }

  let decStr = '';
  if (dec.length > 0) {
    for (let i = 0; i < dec.length; i++) {
      let sum = decStr + dec[i];
      if ((i + 1) % 3 === 0) {
        decStr = sum + ',';
      } else {
        decStr = sum;
      }
    }
  }
  return decStr.length > 0 ? `${intStr}.${decStr}` : `${intStr}`;
}
```
