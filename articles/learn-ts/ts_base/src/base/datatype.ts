// 原始类型
let bool: boolean = true
let num: number | null = 123
let str: string = 'string'

// 数组
let arr1: number[] = [1, 2, 3] //数组里是数字
let arr2: Array<number> = [1, 2, 3]
let arr3: Array<number | string> = [1, 2, 3, '4']

// 元组
let tuple: [number, string] = [0, '1']

// 函数
let add = (x: number, y: number) => x + y
let compute: (x: number, y: number) => number
compute = (x, y) => x + y

//对象
// let obj: object = { x: 1, y: 2 }
// obj.x = 1 //object 上不存在属性“x”
let obj: { x: number, y: number } = { x: 1, y: 2 }
obj.x = 3

// symbol
let s1: symbol = Symbol()
let s2 = Symbol()

// undefined null 是任何类型的子类型
let un: undefined = undefined
let nu: null = null
num = null

// void 没有任何返回值
let noReturn = () => { }

// any
let x

// never 永远不会有返回值的类型
let error = () => {
  throw new Error('never')
}
let endless = () => {
  while (true) { }
}
console.log(num)