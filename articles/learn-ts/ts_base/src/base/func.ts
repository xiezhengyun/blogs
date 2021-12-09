// 函数定义
function add1(x: number, y: number): number {
  return x + y
}

let add2: (x: number, y: number) => number

type add3 = (x: number, y: number) => number

interface add4 {
  (x: number, y: number): number
}

/** 可选参数  必须位于必选参数之后*/
function add5(x: number, y?: number) {
  return y ? x + y : x
}
function add6(x: number, y: number = 2) {
  return x + y
}

function add7(x: number, ...args: number[]) {
  return x + args.reduce((pre, cur) => pre + cur)
}


/** 函数重载 */
// 按顺序匹配
function add8(...rest: number[]): number;
function add8(...rest: string[]): string;
function add8(...rest: any[]) {
  let first = rest[0];
  if (typeof first === 'number') {
      return rest.reduce((pre, cur) => pre + cur);
  }
  if (typeof first === 'string') {
      return rest.join('');
  }
}