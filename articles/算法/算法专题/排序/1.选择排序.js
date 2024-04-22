class generateArr {
  constructor(n) {
    this.n = n;
  }
  getOrderedArr() {
    return Object.keys(Array.apply(null, { length: this.n })).map(item => {
      return +item;
    });
  }
  getRandomArr() {
    return Object.keys(Array.apply(null, { length: this.n })).map(item => {
      return Math.ceil(Math.random() * this.n);
    });
  }
}
class Test {
  constructor(arr) {
    this.arr = arr;
  }
  run(fn, name) {
    const start = +new Date();
    const arr = fn(this.arr);
    const end = +new Date();
    if (this.isOrderly(arr)) {
      console.log(`${name}排序用时共计: ` + (end - start));
    } else {
      console.log(`排序错误`);
    }
  }
  isOrderly(arr) {
    let flag = true;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > arr[i + 1]) {
        flag = false;
        break;
      }
    }
    return flag;
  }
}

//  选择排序
// 假定一个数组长度n，每次取第i个数据，在后面[i, n-1]，中取最小的一个数据，移到当前i的位置。
// 时间复杂度 O(n^2)

function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i; j < arr.length; j++) {
      if (arr[j] - arr[minIndex] < 0) minIndex = j;
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}
console.log(selectionSort([2,1]));

// 插入排序
// 假定一个数组长度n，从左边开始，取第i个数据，在[0, i-1]中移动它应该呆的位置
// 从右边无序的区间，插入左边有序的区间，第i个元素，如果它比左边的数字小，那就把左边的数字右移一位
// 复杂度 O(n^2), 但是越有序的数组越快，完全有序就是O(n)
//[2,1]
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    let j;
    for (j = i - 1; j >= 0 && arr[j] > temp; j--) {
      arr[j + 1] = arr[j];
    }
    arr[j + 1] = temp;
  }
  return arr;
}
console.log(insertionSort([2,1]))

const a = new generateArr(10000).getRandomArr();
const test = new Test(a);
// test.run(selectionSort, 'selectionSort');
// test.run(insertionSort, 'insertionSort');
