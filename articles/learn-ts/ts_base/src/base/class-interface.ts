interface Human {
  name: string,
  eat(): void;
}
// 类实现接口的时候，必须申明接口中所有的属性
// 接口只能约束类的公有成员
class Asian implements Human {
  constructor(name: string) {
    this.name = name
  }
  name: string
  eat(): void { }
  age: number = 1
  sleep() { }
}

// 接口的继承
interface Man extends Human {
  run(): void
}

interface Child {
  cry(): void
}

interface Boy extends Man, Child { }

let boy: Boy = {
  name: '',
  run() { },
  eat() { },
  cry() { }
}

// 接口继承类
class Auto {
  state = 1
  // private s2 = 2
}
interface AutoInterface extends Auto {

}
class C implements AutoInterface {
  constructor(public state: number) {
    this.state = state
  }
  private s2 = 2
  
}
// 接口在抽离类的成员的时候，私有成员也被抽离
class Bus extends Auto implements AutoInterface{

}

/*
 * 
 *                      implements
 *  extends               (public)
 * interface    ------------------------->     class extends
 *              <-------------------------               
 *                        extends
 *              ( public, private, protected)
 * 
 * 接口可以通过类实现，但是接口只能约束类的公有成员
 * 接口也可以抽离出类的成员，抽离的时候，会包括 公有成员，私有成员，受保护成员
 * 
 * 接口之间可以相互继承，接口的复用
 * 类之间也可以相互继承，方法和属性的复用
 * 
 * 
*/