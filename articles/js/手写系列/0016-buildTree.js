function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //

  // 先转成map存储
  for (const item of items) {
    itemMap[item.id] = { ...item, children: [] };
  }

  for (const item of items) {
    const id = item.id;
    const pid = item.pid;
    const treeItem = itemMap[id];
    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}

function arrayToTree2(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      };
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]['children'],
    };

    const treeItem = itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}

let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 2 },
  { id: 5, name: '部门5', pid: 3 },
];

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
        const newItem = { ...item, children: [] };
        result.push(newItem);
        getChildren(data, newItem.children, item.id);
      }
    }
  };

  const result = [];
  getChildren(data, result, pid);
  return result;
};
