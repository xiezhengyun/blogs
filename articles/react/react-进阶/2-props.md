# props 的用法

- ① props 作为一个子组件渲染数据源。
- ② props 作为一个通知父组件的回调函数。
- ③ props 作为一个单纯的组件传递。
- ④ props 作为渲染函数。
- ⑤ render props ， 和 ④ 的区别是放在了 children 属性上。
- ⑥ render component 插槽组件。

```js
/* children 组件 */
function ChidrenComponent() {
  return <div> In this chapter, let's learn about react props ! </div>
}
/* props 接受处理 */
class PropsComponent extends React.Component {
  componentDidMount() {
    console.log(this, '_this')
  }
  render() {
    const { children, mes, renderName, say, Component } = this.props
    const renderFunction = children[0]
    const renderComponent = children[1]
    /* 对于子组件，不同的props是怎么被处理 */
    return (
      <div>
        {renderFunction()}
        {mes}
        {renderName()}
        {renderComponent}
        <Component />
        <button onClick={() => say()}> change content </button>
      </div>
    )
  }
}
/* props 定义绑定 */
class Index extends React.Component {
  state = {
    mes: 'hello,React',
  }
  node = null
  say = () => this.setState({ mes: 'let us learn React!' })
  render() {
    return (
      <div>
        <PropsComponent
          mes={this.state.mes} // ① props 作为一个渲染数据源
          say={this.say} // ② props 作为一个回调函数 callback
          Component={ChidrenComponent} // ③ props 作为一个组件
          renderName={() => <div> my name is alien </div>} // ④ props 作为渲染函数
        >
          {() => <div>hello,world</div>} {/* ⑤render props */}
          <ChidrenComponent /> {/* ⑥render component */}
        </PropsComponent>
      </div>
    )
  }
}
```

如果 Container 的 Children 既有函数也有组件

```jsx
;<Container>
  <Children />
  {ContainerProps => <Children {...ContainerProps} name={'haha'} />}
</Container>

const Children = props => (
  <div>
    <div>hello, my name is {props.name} </div>
    <div> {props.mes} </div>
  </div>
)

function Container(props) {
  const ContainerProps = {
    name: 'alien',
    mes: 'let us learn react',
  }
  return props.children.map(item => {
    if (React.isValidElement(item)) {
      // 判断是 react elment  混入 props
      return React.cloneElement(item, { ...ContainerProps }, item.props.children)
    } else if (typeof item === 'function') {
      return item(ContainerProps)
    } else return null
  })
}

const Index = () => {
  return (
    <Container>
      <Children />
      {ContainerProps => <Children {...ContainerProps} name={'haha'} />}
    </Container>
  )
}
```

## 实现一个简单的 <Form> <FormItem>嵌套组件

### \<Form>

- 首先考虑到 <Form> 在不使用 forwardRef 前提下，最好是类组件，因为只有类组件才能获取实例。
- 创建一个 state 下的 formData 属性，用于收集表单状态。
- 要封装 重置表单，提交表单，改变表单单元项的方法。
- 要过滤掉除了 FormItem 元素之外的其他元素，那么怎么样知道它是不是 FormItem，这里教大家一种方法，可以给函数组件或者类组件绑定静态属性来证明它的身份，然后在遍历 props.children 的时候就可以在 React element 的 type 属性(类或函数组件本身)上，验证这个身份，在这个 demo 项目，给函数绑定的 displayName 属性，证明组件身份。
- 要克隆 FormItem 节点，将改变表单单元项的方法 handleChange 和表单的值 value 混入 props 中。

```js
class Form extends React.Component {
  state = {
    formData: {},
  }
  /* 用于提交表单数据 */
  submitForm = cb => {
    cb({ ...this.state.formData })
  }
  /* 获取重置表单数据 */
  resetForm = () => {
    const { formData } = this.state
    Object.keys(formData).forEach(item => {
      formData[item] = ''
    })
    this.setState({
      formData,
    })
  }
  /* 设置表单数据层 */
  setValue = (name, value) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value,
      },
    })
  }
  render() {
    const { children } = this.props
    const renderChildren = []
    React.Children.forEach(children, child => {
      if (child.type.displayName === 'formItem') {
        const { name } = child.props
        /* 克隆`FormItem`节点，混入改变表单单元项的方法 */
        const Children = React.cloneElement(
          child,
          {
            key: name /* 加入key 提升渲染效果 */,
            handleChange: this.setValue /* 用于改变 value */,
            value: this.state.formData[name] || '' /* value 值 */,
          },
          child.props.children
        )
        renderChildren.push(Children)
      }
    })
    return renderChildren
  }
}
/* 增加组件类型type  */
Form.displayName = 'form'
```

### \<FormItem>

- FormItem 一定要绑定 displayName 属性，用于让 \<Form> 识别 \<FormItem />
  声明 onChange 方法，通过 props 提供给\<Input>，作为改变 value 的回调函数。
- FormItem 过滤掉除了 input 以外的其他元素。

```js
function FormItem(props) {
  const { children, name, handleChange, value, label } = props
  const onChange = value => {
    /* 通知上一次value 已经改变 */
    handleChange(name, value)
  }
  return (
    <div className='form'>
      <span className='label'>{label}:</span>
      {React.isValidElement(children) && children.type.displayName === 'input' ? React.cloneElement(children, { onChange, value }) : null}
    </div>
  )
}
FormItem.displayName = 'formItem'
```

### \<Input />

- 绑定 displayName 标识 input。
- input DOM 元素，绑定 onChange 方法，用于传递 value 。

```js
/* Input 组件, 负责回传value值 */
function Input({ onChange, value }) {
  return <input className='input' onChange={e => onChange && onChange(e.target.value)} value={value} />
}
/* 给Component 增加标签 */
Input.displayName = 'input'
```
