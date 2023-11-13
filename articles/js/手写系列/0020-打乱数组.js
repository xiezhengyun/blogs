function getRandomInt(lower, upper) {
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
}

/**
 * @param {any[]} arr
 */
function shuffle(arr) {
  let insertPos = 0;
  const lastPos = arr.length - 1;

  while (insertPos <= lastPos) {
    const randomPos = getRandomInt(insertPos, lastPos);
    // swap
    const tmp = arr[insertPos];
    arr[insertPos] = arr[randomPos];
    arr[randomPos] = tmp;

    insertPos++;
  }
  return arr
}
console.log(shuffle([1,2,3,4,5,6,7]))
console.log(randomSort([1,2,3,4,5,6,7]))

function randomSort(array) {
  let length = array.length;

  if (!Array.isArray(array) || length <= 1) return;

  for (let index = 0; index < length - 1; index++) {
    let randomIndex = Math.floor(Math.random() * (length - index)) + index;

    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }

  return array;
}