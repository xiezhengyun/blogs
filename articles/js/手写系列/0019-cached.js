const add = function() {
  const cached = {}
  return (...args) => {
    const key = args.join(',');
    if (!(key in cached)) {
      cached[key] = args.reduce((a, b) => a + b)
    }
    return cached[key]
  }
}()

console.log(add(1,2))
console.log(add(1,2))
console.log(add(1,2,3))
console.log(add(1,2))
console.log(add(1,2,3))