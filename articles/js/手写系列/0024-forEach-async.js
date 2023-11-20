var getNumbers = () => {
  return Promise.resolve([1, 2, 3])
}
var multi = num => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (num) {
        resolve(num * num)
      } else {
        reject(new Error('num not specified'))
      }
    }, 1000)
  })
}

async function test() {
  var nums = await getNumbers()
  nums.forEach(async x => {
    var res = await multi(x)
    console.log(res)
  })
}

// 顺序执行

// 1 改造forEach
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
async function test() {
  var nums = await getNumbers()
  asyncForEach(nums, async x => {
    var res = await multi(x)
    console.log(res)
  })
}

// 2 for of
async function test() {
  var nums = await getNumbers()
  for (let x of nums) {
    var res = await multi(x)
    console.log(res)
  }
}

// 3 async for
;(async function () {
  var nums = await getNumbers()

  for (let i = 0; i < nums.length; i += 1) {
    var res = await multi(nums[i])

    console.log(res)
  }
})()
