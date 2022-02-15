# 保证状态最小化

> 在保证 State 完整性的同时，也要保证它的最小化

某些数据如果能从已有的 State 中计算得到，那么我们就应该始终在用的时候去计算，而不要把计算的结果存到某个 State 中。**这样的话，才能简化我们的状态处理逻辑。**

```js
import React, { useState, useMemo } from 'react';

function FilterList({ data }) {
  const [searchKey, setSearchKey] = useState('');
  const filtered = useMemo(() => {
    return data.filter(item => item.title.toLowerCase().includes(searchKey.toLowerCase()));
  }, [searchKey, data]);

  return (
    <div className="08-filter-list">
      <h2>Movies</h2>
      <input value={searchKey} placeholder="Search..." onChange={evt => setSearchKey(evt.target.value)} />
      <ul style={{ marginTop: 20 }}>
        {filtered.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

按照直觉，过滤后的结果数据，这个状态其实是冗余的， 这个结果数据实际上完全由原始数据和过滤关键字决定，那么我们在需要的时候每次重新计算得出就可以了

# 避免中间状态，确保唯一数据源

在有的场景下，特别是原始状态数据来自某个外部数据源，而非 state 或者 props 的时候，冗余状态就没那么明显。这时候你就需要准确定位状态的数据源究竟是什么，并且在开发中确保它始终是唯一的数据源，以此避免定义中间状态。

下面这个例子：保证url上的参数和input输入框的数据保持一致，这样搜索出来，可以通过url分享出去。

直觉做法：我们要有更加完善的机制，让在 URL 不管因为什么原因而发生变化的时候，都能同步查询参数到 searchKey 这个 State。但是如果沿着这个思路，那么状态管理就会一下子变得非常复杂。因为我们需要维护三个状态的一致性。

如果我们遵循唯一数据源这个原则，把 URL 上的查询关键字作为唯一数据源，逻辑就会变得简单了：只需要在用户输入查询关键字时，直接去改变 URL 上的查询字符串就行

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/8ef74f9856c75bc93e315ff952004349a418403d.png)

```js
import React, { useCallback, useMemo } from 'react';
import { useSearchParam } from 'react-use';
function SearchBox({ data }) {
  // 使用 useSearchParam 这个 Hook 用于监听查询参数变化
  const searchKey = useSearchParam('key') || '';
  const filtered = useMemo(() => {
    return data.filter(item => item.title.toLowerCase().includes(searchKey.toLowerCase()));
  }, [searchKey, data]);
  const handleSearch = useCallback(evt => {
    // 当用户输入时，直接改变 URL
    window.history.pushState({}, '', `${window.location.pathname}?key=${evt.target.value}`);
  }, []);
  return (
    <div className="08-filter-list">
      <h2>Movies (Search key from URL)</h2>
      <input value={searchKey} placeholder="Search..." onChange={handleSearch} />
      <ul style={{ marginTop: 20 }}>
        {filtered.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

当用户输入参数的时候，我们是直接改变当前的 URL，而不是去改变一个内部的状态。所以当 URL 变化的时候，我们使用了 useSearchParam 这样一个第三方的 Hook 去绑定查询参数，并将其显示在输入框内，从而实现了输入框内容和查询关键字这个状态的同步。

从本质上来说，这个例子展示了确保状态唯一数据源的重要性。我们是直接将 URL 作为唯一的数据来源，那么状态的读取和修改都是对 URL 直接进行操作，而不是通过一个中间的状态。这样就简化了状态的管理，保证了状态的一致性。
