# symbol

Symbol 值通过 Symbol 函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突

## symbol 规范

当调用 Symbol 的时候，会采用以下步骤

- 如果使用 new ，就报错
- 如果 description 是 undefined，让 descString 为 undefined
- 否则 让 descString 为 ToString(description)
- 如果报错，就返回
- 返回一个新的唯一的 Symbol 值，它的内部属性 [[Description]] 值为 descString

```js
// 第一版
(function () {
  var root = this;

  var SymbolPolyfill = function Symbol(description) {
    // 实现特性第 2 点：Symbol 函数前不能使用 new 命令
    if (this instanceof SymbolPolyfill) throw new TypeError('Symbol is not a constructor');

    // 实现特性第 5 点：如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。
    var descString = description === undefined ? undefined : String(description);

    var symbol = Object.create(null);

    Object.defineProperties(symbol, {
      __Description__: {
        value: descString,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });

    // 实现特性第 6 点，因为调用该方法，返回的是一个新对象，两个对象之间，只要引用不同，就不会相同
    return symbol;
  };

  root.SymbolPolyfill = SymbolPolyfill;
})();
```
