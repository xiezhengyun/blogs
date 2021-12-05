// 数字枚举 默认从0开始，递增，也可自己定义，后面也是递增
// 反向映射 
enum Role {
  Reporte,
  Developer,
  Maintainer,
  Owner,
  Guest,
}
console.log(Role)

// 字符串枚举
enum Message {
  Success = '成功',
  Fail = '失败'
}

// 异构枚举
enum Answer {
  N,
  Y = 'yes',
}

// 枚举成员 性质
enum Char {
  // const 常量枚举成员 3种情况
  a,
  b = Char.a,
  c = 1 + 3,
  // computed number 需要被计算 程序执行阶段才会计算
  d = Math.random(),
  e = '122'.length
}

// 常量枚举 编译阶段被移除 
// 只需要对象的值的时候
const enum Month {
  Jan,
  Feb,
  Mar
}
// 这样，编译成功，代码中，只有常量，没有枚举 （只有month 这个数组） let month = [0 /* Jan */];
let month: Array<string | number> = [Month.Jan]

// 枚举类型
enum E { a, b }
enum F { a = 0, b = 1 }
enum G { a = 'apple', b = 'bbbb' }

let e: E = 3
let f: F = 3
console.log('e------: ', e) //3
// e === f error 不能进行比较

let e1: E.a = 1
let e2: E.b = 2
let e3: E.a = 3
// e1 === e2 error 不能进行比较
console.log('e1 === e3: ', e1 === e3)  //false

let g1: G = G.a
let g2: G.a = G.a // g2只能取G.a