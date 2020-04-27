## less
less 官网的文档非常清楚。[less文档](https://less.bootcss.com/#%E6%A6%82%E8%A7%88)
所以这里讲一点使用率很高的。

#### 嵌套语法
```css
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
```
用 Less 语言我们可以这样书写代码：
```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
/*这样注释*/
//也可以这样注释
.clearfix {
  display: block;
  zoom: 1;

  &:after {   // & 表示当前选择器的父级，也就是clearfix
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```
这么写非常方便，不用担心变量污染，样式覆盖。代码清晰。& 表示当前选择器的父级）

#### 变量
```less
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```
编译为：
```css
#header {
  width: 10px;
  height: 20px;
}
```
相当于变量，在页面的公共样式的颜色风格里非常有用。可以跨页面使用。

#### 导入
如果你需要定义一个很多页面都需要使用的变量，比如颜色变量。
+ 在 publicVar.less 页面定义 ``@myColor:red;``
+ 在a页面的less文件顶部先引入 publicVar.less： ``@import '你的目录/publicVar.less';``
+ 在a页面的less文件即可使用``#header {color: @myColor;}``

#### 混合
混合（Mixin）是一种将一组属性从一个规则集包含（或混入）到另一个规则集的方法。假设我们定义了一个类（class）如下：
```css
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```
如果我们希望在其它规则集中使用这些属性呢？没问题，我们只需像下面这样输入所需属性的类（class）名称即可，如下所示：
```less
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```