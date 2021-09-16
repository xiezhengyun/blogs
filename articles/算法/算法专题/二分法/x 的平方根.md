# 69. x 的平方根

给你一个非负整数 x ，计算并返回  x  的 平方根 。

由于返回类型是整数，结果只保留 整数部分 ，小数部分将被 舍去 。

注意：不允许使用任何内置指数函数和算符，例如 pow(x, 0.5) 或者 x \*\* 0.5 。

- 二分法查找
- 考虑的点是，区间的选择，以及维持区间

```js
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
  if (x < 2) return x;
  var l = 1,
    r = x >> 1;
  while (l <= r) {
    var mid = (l + r) >> 1;
    var y = mid * mid;
    if (y === x) return mid;
    if (y > x) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return r;
};
```
