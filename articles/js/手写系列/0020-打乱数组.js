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
}
