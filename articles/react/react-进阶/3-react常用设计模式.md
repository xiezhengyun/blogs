## 组合模式(props 节 表单的例子 )

组合模式适合一些容器组件场景，通过外层组件包裹内层组件，这种方式在 Vue 中称为 slot 插槽，外层组件可以轻松的获取内层组件的 props 状态，还可以控制内层组件的渲染，组合模式能够直观反映出 父 -> 子组件的包含关系.

- 组合模式通过外层组件获取内层组件 children ，通过 cloneElement 传入新的状态，或者控制内层组件渲染。
- 组合模式还可以和其他组件组合，或者是 render props，拓展性很强，实现的功能强大。

```jsx
;<Groups>
  <Item name='《React进阶实践指南》' />
  <Item name='《Nodejs深度学习手册》' />
</Groups>

function Groups(props) {
  console.log(props.children) // Groups element
  React.Children.forEach(props.children, item => {
    console.log(item.props) //依次打印 props
  })
  return props.children
}
```

```js
const Tab = ({ children, onChange }) => {
  const activeIndex = useRef(null)
  const [, forceUpdate] = useState({})
  /* 提供给 tab 使用  */
  const tabList = []
  /* 待渲染组件 */
  let renderChildren = null
  React.Children.forEach(children, item => {
    /* 验证是否是 <TabItem> 组件  */
    if (React.isValidElement(item) && item.type.displayName === 'tabItem') {
      const { props } = item
      const { name, label } = props
      const tabItem = {
        name,
        label,
        active: name === activeIndex.current,
        component: item,
      }
      if (name === activeIndex.current) renderChildren = item
      tabList.push(tabItem)
    }
  })
  /* 第一次加载，或者 prop chuldren 改变的情况 */
  if (!renderChildren && tabList.length > 0) {
    const fisrtChildren = tabList[0]
    renderChildren = fisrtChildren.component
    activeIndex.current = fisrtChildren.component.props.name
    fisrtChildren.active = true
  }

  /* 切换tab */
  const changeTab = name => {
    activeIndex.current = name
    forceUpdate({})
    onChange && onChange(name)
  }

  return (
    <div>
      <div className='header'>
        {tabList.map((tab, index) => (
          <div className='header_item' key={index} onClick={() => changeTab(tab.name)}>
            <div className={'text'}>{tab.label}</div>
            {tab.active && <div className='active_bored'></div>}
          </div>
        ))}
      </div>
      <div>{renderChildren}</div>
    </div>
  )
}

Tab.displayName = 'tab'
```

## render props 模式

```js
export default function App() {
  const aProps = {
    name: '《React》',
  }
  return <Container>{cProps => <Children {...cProps} {...aProps} />}</Container>
}
```

render props 模式和组合模式类似。区别不同的是，用函数的形式代替 children。函数的参数，由容器组件提供，这样的好处，将容器组件的状态，提升到当前外层组件中，这个是一个巧妙之处，也是和组合模式相比最大的区别。

这种模式更适合一种，容器包装，状态的获取. 比如

- context 中的 Consumer,

```js
const Context = React.createContext(null)
function Index() {
  return (
    <Context.Consumer>
      {contextValue => (
        <div>
          名称：{contextValue.name}
          作者：{contextValue.author}
        </div>
      )}
    </Context.Consumer>
  )
}

export default function App() {
  const value = {
    name: 'name',
    author: 'author',
  }
  return (
    <Context.Provider value={value}>
      <Index />
    </Context.Provider>
  )
}
```

- 派生新状态

```js
 <Container>
        {(cProps) => {
            const  const nProps =  getNewProps( aProps , cProps )
            return <Children {...nProps} />
        }}
 </Container>
```

- 反向状态回传

```js
function GetContanier(props) {
  const dom = useRef()
  const getDom = () => dom.current
  return <div ref={dom}>{props.children({ getDom })}</div>
}

export default function App() {
  /* 保存 render props 回传的状态 */
  const getChildren = useRef(null)
  useEffect(() => {
    const childDom = getChildren.current()
    console.log(childDom, 'childDom')
  }, [])
  return (
    <GetContanier>
      {({ getDom }) => {
        getChildren.current = getDom
        return <div></div>
      }}
    </GetContanier>
  )
}
```
- 容器组件作用是传递状态，执行 children 函数。
- 外层组件可以根据容器组件回传 props ，进行 props 组合传递给子组件。
- 外层组件可以使用容器组件回传状态。

## HOC

## createContext 提供者模式

## 类组件继承