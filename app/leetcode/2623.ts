type Fn = (...params: any) => any

function memoize(fn: Fn): Fn {
  const cache: Array<{ key: Array<any>; val: any }> = []

  return function (...args) {
    let item = cache.find(c => c.key.every((val, index) => val === args[index]))

    if (item === undefined) {
      item = {
        key: args,
        val: fn(...args),
      }
      cache.push(item)
    }
    return item.val
  }
}

let callCount = 0
const memoizedFn = memoize((...arr: Array<number>) => {
  callCount++
  return arr.reduce((a, b) => (a + b), 0)
})
memoizedFn()
memoizedFn(1)
memoizedFn(1)
memoizedFn()
memoizedFn(1, 2)
memoizedFn(1, 2)
console.log('callCount', callCount)
