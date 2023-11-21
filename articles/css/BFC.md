# BFC
BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与（在下面有解释）， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干

>**(BFC 可以简单的理解为某个元素的一个 CSS 属性，只不过这个属性不能被开发者显式的修改，拥有这个属性的元素对内部元素和外部元素会表现出一些特性，这就是BFC。)**

- 块级格式化上下文（BFC，block formatting context）。
- 内联格式化上下文（IFC，inline formatting context）。
- 弹性格式化上下文（FFC，flex formatting context），在 CSS3 中定义。
- 栅格格式化上下文（GFC，grid formatting context），在 CSS3 中定义。

## 触发条件或者说哪些元素会生成BFC：
- 根元素，即HTML元素
- float的值不为none
- overflow的值不为visible
- display的值为inline-block、table-cell、table-caption
- position的值为absolute或fixed 　

## BFC布局规则
- 内部的Box会在垂直方向，一个接一个地放置。
- Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
- 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此
- BFC的区域不会与float box重叠。
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
- 计算BFC的高度时，浮动元素也参与计算

## BFC 应用
- 自适应两栏布局
- 可以阻止元素被浮动元素覆盖
- 可以包含浮动元素——清除内部浮动
- 分属于不同的BFC时可以阻止margin重叠