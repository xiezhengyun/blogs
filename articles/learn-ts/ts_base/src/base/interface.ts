
interface List {
  readonly id: number; // 只读属性
  name: string,
  age?: number, //可选属性
  [x: string]: any //多出来的字段
}
interface Result {
  data: List[]
}

export function render(result: Result) {
  result.data.forEach((val) => {
    console.log(val.id, val.name)
    if (val.age) console.log(val.age)
  })
}

export let result = {
  data: [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
  ]
}

render(result)

render({
  data: [
    { id: 1, name: 'name1', sex: 'male' },
    { id: 2, name: 'name2' },
  ]
} as Result) // 直接放进去，要加类型断言


// 字符串数组
// 当用 number去索引StringArray时会得到string类型的返回值。
interface StringArray {
  [index: number]: string
}
let chars: StringArray = ['A', 'B']

// 可以用数字去索引name，也可以用字符串
interface Names {
  [x: string]: string,
  [z: number]: string
}

// 函数类型接口
interface Add {
  (x: number, y: number): number
}

type Add2 = (x: number, y: number) => number

let add: Add | Add2 = (a, b) => a + b

/**********混合类型接口*************************************************/
interface Lib {
  (): void; //返回值
  version: string;  //属性
  doSomething(): void //方法
}

function getLib() {
  let lib: Lib = (() => { }) as Lib
  lib.version = '1.0'
  lib.doSomething = () => { }
  return lib
}
let lib1 = getLib()
lib1.version

interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = (function (start: number) { }) as Counter
  counter.interval = 123;
  counter.reset = function () { };
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;