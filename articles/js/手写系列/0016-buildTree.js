function arrayToTree(items) {
  const result = [] // 存放结果集
  const itemMap = {} //

  // 先转成map存储
  for (const item of items) {
    itemMap[item.id] = { ...item, children: [] }
  }

  for (const item of items) {
    const id = item.id
    const pid = item.pid
    const treeItem = itemMap[id]
    if (pid === 0) {
      result.push(treeItem)
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }
  }
  return result
}

function arrayToTree2(items) {
  const result = [] // 存放结果集
  const itemMap = {} //
  for (const item of items) {
    const id = item.id
    const pid = item.pid

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]['children'],
    }

    const treeItem = itemMap[id]

    if (pid === 0) {
      result.push(treeItem)
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }
  }
  return result
}

function listToTree(list, rootId = null, { idName = 'id', pidName = 'pid', childName = 'children' } = {}) {
  const record = {} // 用空间换时间，仅用于记录 children
  const root = []

  list.forEach(item => {
    const newItem = Object.assign({}, item) // 如有需要，可以复制 item ，可以不影响 list 中原有的元素。
    const id = newItem[idName]
    const parentId = newItem[pidName]

    // 如果当前 id 的 children 已存在，则加入 children 字段中，否则，初始化 children
    // item 与 record[id] 引用同一份 children，后续迭代中更新 record[parendId] 就会反映到 item 中
    newItem[childName] = record[id] ? record[id] : (record[id] = [])

    if (parentId === rootId) {
      root.push(newItem)
    } else {
      if (!record[parentId]) {
        record[parentId] = []
      }
      record[parentId].push(newItem)
    }
  })

  return root
}

let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 2 },
  { id: 5, name: '部门5', pid: 3 },
]

/**
 * 转换方法
 */
const arrayToTree3 = (data, pid = 0) => {
  /**
   * 递归查找，获取children
   */
  const getChildren = (data, result, pid) => {
    for (const item of data) {
      if (item.pid === pid) {
        const newItem = { ...item, children: [] }
        result.push(newItem)
        getChildren(data, newItem.children, item.id)
      }
    }
  }

  const result = []
  getChildren(data, result, pid)
  return result
}

function buildthree(arr, pid = 0) {
  let res = []

  function getChildren(result, pid) {
    for (const item of arr) {
      if (item.pid === pid) {
        const newItem = { ...item, children: [] }
        result.push(newItem)
        getChildren(newItem.children, item.id)
      }
    }
  }
  getChildren(res, pid)
  return res
}
console.log(JSON.stringify(buildthree(arr), null, 2))
