# 768. 最多能完成排序的块 II

这个问题和“最多能完成排序的块”相似，但给定数组中的元素可以重复，输入数组最大长度为 2000，其中的元素最大为 10\*\*8。

arr 是一个可能包含重复元素的整数数组，我们将这个数组分割成几个“块”，并将这些块分别进行排序。之后再连接起来，使得连接的结果和按升序排序后的原数组相同。

我们最多能将数组分成多少块？

```
输入: arr = [5,4,3,2,1]
输出: 1
解释:
将数组分成2块或者更多块，都无法得到所需的结果。
例如，分成 [5, 4], [3, 2, 1] 的结果是 [4, 5, 1, 2, 3]，这不是有序的数组。

输入: arr = [2,1,3,4,4]
输出: 4
解释:
我们可以把它分成两块，例如 [2, 1], [3, 4, 4]。
然而，分成 [2, 1], [3], [4], [4] 可以得到最多的块数。
```

- 原数组进行分块后，每一个分块和排序后的数组中对应的分块数字是一样的，只是排序不同
- 每个分块中数字是一样的，那它们的和也是一样
- 滑动擦窗口计算和

![](https://pic.leetcode-cn.com/1606111912-wannQR-file_1606111913461)

```js
/**
 * @param {number[]} arr
 * @return {number}
 */
var maxChunksToSorted = function (arr) {
  var sorted = [...arr];
  sorted.sort((a, b) => a - b);

  var count = 0,
    sum1 = 0,
    sum2 = 0;
  for (let i = 0; i < arr.length; i++) {
    sum1 += arr[i];
    sum2 += sorted[i];
    if (sum1 === sum2) count++;
  }
  return count;
};
```
