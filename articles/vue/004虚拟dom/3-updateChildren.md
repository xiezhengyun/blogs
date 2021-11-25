# updateChildren

`updateChildren` 具体做法就是对 `newChildren` 和 `oldChildren` 这两个两个子节点数组通过循环对比。
外层循环 newChildren 数组，内层循环 oldChildren 数组，每循环外层 newChildren 数组里的一个子节点，就去内层 oldChildren 数组里找看有没有与之相同的子节点，伪代码如下：

```js
for (let i = 0; i < newChildren.length; i++) {
  const newChild = newChildren[i];
  for (let j = 0; j < oldChildren.length; j++) {
    const oldChild = oldChildren[j];
    if (newChild === oldChild) {
      // ...
    }
  }
}
```

这个过程中主要做了四件事。

- 创建子节点

  如果 newChildren 里面的某个子节点在 oldChildren 里找不到与之相同的子节点，那么说明 newChildren 里面的这个子节点是之前没有的，是需要此次新增的节点，那么就创建子节点  
  **合适的位置是所有未处理节点之前，而并非所有已处理节点之后**

- 删除子节点

  如果把 newChildren 里面的每一个子节点都循环完毕后，发现在 oldChildren 还有未处理的子节点，那就说明这些未处理的子节点是需要被废弃的，那么就将这些节点删除

- 移动子节点

  如果 newChildren 里面的某个子节点在 oldChildren 里找到了与之相同的子节点，但是所处的位置不同，这说明此次变化需要调整该子节点的位置，那就以 newChildren 里子节点的位置为基准，调整 oldChildren 里该节点的位置，使之与在 newChildren 里的位置相同。  
  **所有未处理节点之前就是我们要移动的目的位置**

- 更新节点

  如果 newChildren 里面的某个子节点在 oldChildren 里找到了与之相同的子节点，并且所处的位置也相同，那么就调用 patchVnode 更新节点（递归处理），使之与 newChildren 里的该节点相同

## 优化

直接双层循环性能，在节点数量很多的情况下，时间复杂度很高。其实在工作的过程中，想象一下，一个列表。节点的变化是有一定规律的。比如新增，删除，插入之类的。针对这些情况，有一定优化可以做。

那么我们该怎么优化呢？其实我们可以这样想，我们不要按顺序去循环 newChildren 和 oldChildren 这两个数组，可以先比较这两个数组里特殊位置的子节点，比如：

- 先把 newChildren 数组里的所有未处理子节点的第一个子节点和 oldChildren 数组里所有未处理子节点的第一个子节点做比对，如果相同，那就直接进入更新节点的操作；

- 如果不同，再把 newChildren 数组里所有未处理子节点的最后一个子节点和 oldChildren 数组里所有未处理子节点的最后一个子节点做比对，如果相同，那就直接进入更新节点的操作；

- 如果不同，再把 newChildren 数组里所有未处理子节点的最后一个子节点和 oldChildren 数组里所有未处理子节点的第一个子节点做比对，如果相同，那就直接进入更新节点的操作，更新完后再将 oldChildren 数组里的该节点移动到与 newChildren 数组里节点相同的位置；

- 如果不同，再把 newChildren 数组里所有未处理子节点的第一个子节点和 oldChildren 数组里所有未处理子节点的最后一个子节点做比对，如果相同，那就直接进入更新节点的操作，更新完后再将 oldChildren 数组里的该节点移动到与 newChildren 数组里节点相同的位置；

- 最后四种情况都试完如果还不同，那就按照之前循环的方式来查找节点。

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/8a984c69de25c6191c533cb856126d48d2310c33.png)

```js
// 循环更新子节点
function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  let oldStartIdx = 0; // oldChildren开始索引
  let oldEndIdx = oldCh.length - 1; // oldChildren结束索引
  let oldStartVnode = oldCh[0]; // oldChildren中所有未处理节点中的第一个
  let oldEndVnode = oldCh[oldEndIdx]; // oldChildren中所有未处理节点中的最后一个

  let newStartIdx = 0; // newChildren开始索引
  let newEndIdx = newCh.length - 1; // newChildren结束索引
  let newStartVnode = newCh[0]; // newChildren中所有未处理节点中的第一个
  let newEndVnode = newCh[newEndIdx]; // newChildren中所有未处理节点中的最后一个

  let oldKeyToIdx, idxInOld, vnodeToMove, refElm;

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  const canMove = !removeOnly;

  if (process.env.NODE_ENV !== 'production') {
    checkDuplicateKeys(newCh);
  }

  // 以"新前"、"新后"、"旧前"、"旧后"的方式开始比对节点
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]; // 如果oldStartVnode不存在，则直接跳过，比对下一个
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 如果新前与旧前节点相同，就把两个节点进行patch更新
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 如果新后与旧后节点相同，就把两个节点进行patch更新
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      // 如果新后与旧前节点相同，先把两个节点进行patch更新，然后把旧前节点移动到oldChilren中所有未处理节点之后
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      // 如果新前与旧后节点相同，先把两个节点进行patch更新，然后把旧后节点移动到oldChilren中所有未处理节点之前
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 如果不属于以上四种情况，就进行常规的循环比对patch
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
      // 如果在oldChildren里找不到当前循环的newChildren里的子节点
      if (isUndef(idxInOld)) {
        // New element
        // 新增节点并插入到合适位置
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
      } else {
        // 如果在oldChildren里找到了当前循环的newChildren里的子节点
        vnodeToMove = oldCh[idxInOld];
        // 如果两个节点相同
        if (sameVnode(vnodeToMove, newStartVnode)) {
          // 调用patchVnode更新节点
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          // canmove表示是否需要移动节点，如果为true表示需要移动，则移动节点，如果为false则不用移动
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
        } else {
          // same key but different element. treat as new element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  if (oldStartIdx > oldEndIdx) {
    /**
     * 如果oldChildren比newChildren先循环完毕，
     * 那么newChildren里面剩余的节点都是需要新增的节点，
     * 把[newStartIdx, newEndIdx]之间的所有节点都插入到DOM中
     */
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
  } else if (newStartIdx > newEndIdx) {
    /**
     * 如果newChildren比oldChildren先循环完毕，
     * 那么oldChildren里面剩余的节点都是需要删除的节点，
     * 把[oldStartIdx, oldEndIdx]之间的所有节点都删除
     */
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}
```

## 优化 2

那就是在我们前面所说的优化策略中，节点有可能是从前面对比，也有可能是从后面对比，对比成功就会进行更新处理，也就是说我们有可能处理第一个，也有可能处理最后一个，那么我们在循环的时候就不能简单从前往后或从后往前循环，**而是要从两边向中间循环**。

- newStartIdx和oldStartIdx只能往后移动（只会加），newEndIdx和oldEndIdx只能往前移动（只会减）。

![](https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/bcf6727230a6a6a10af9f89ea7cb15f070a6a14e.png)
