// 内部属性 name ，只在实例(dog)上，而不在原型上（Dog.protitype）
class Dog {
  constructor(name: string) {
    this.name = name
  }
  public name: string
  run() { }

  private pri() { }  // 私有

  protected pro() { } //受保护 成员，只能在类，或者子类中访问

  readonly rea: string = 'rea' // 只读属性

  static foot: string = 'bones' //静态成员， 只能通过类名调用
}

Dog.foot

let dog = new Dog('a')
// dog.pri() 私有成员 报错
// dog.pro() 受保护 成员，只能在类，或者子类中访问
// dog.foot 

// 继承
class Husky extends Dog {
  // 子类中，构造函数，的参数就可以，定义属性，加关键字
  constructor(name: string, public color: string) {
    super(name)
    this.color = color
    // this.pri()  私有成员 报错
    this.pro()
  }
  // color: string
}
Husky.foot //静态成员 被继承

// 类的成员修饰符
// 类的所有属性，默认 public
// 如果类的构造函数， 加了 私有属性  private， 这个类，既不能被实例化，也不能被继承
// 如果类的构造函数， 加了 受保护属性  protected, 这个类，不能被实例化，只能被继承 （基类）


/**抽象类   不能被实例化   */
abstract class Animal {
  eat() {
    console.log('eat')
  }
  // 不指定方法的具体实现， 抽象方法
  abstract sleep(): void
}
// let animal = new Animal() 不能被实例化
class Cat extends Animal {
  constructor(name: string) {
    super()
    this.name = name
  }
  name: string

  sleep(): void {
    console.log('Cat sleep')
  }
}
let cat = new Cat('cc')
cat.eat()

/** 多态 */
class Cat2 extends Animal {
  sleep(): void {
    console.log('Cat2 sleep')
  }
}
let cat2 = new Cat2()
// cat2.sleep()

let animals: Animal[] = [cat, cat2]
animals.forEach(item=>{
  item.sleep()
})


// 类式类型  链式调用
class WorkFlow{
  step1(){
    return this
  }
  step2(){
    return this
  }
}
new WorkFlow().step1().step2()

class MyFlow extends WorkFlow {
  next(){
    return this
  }
}
// 父类和子类之间，接口链式调用
new MyFlow().next().step1().next().step2()