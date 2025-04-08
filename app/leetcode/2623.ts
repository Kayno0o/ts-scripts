type Fn = (...params: any) => any

function memoize(fn: Fn): Fn {
  const cache = new Map<string, any>()

  return function (...args) {
    const key = args.join(',')

    if (!cache.has(key))
      cache.set(key, fn(...args))

    return cache.get(key)
  }
}

let callCount = 0
const memoizedFn = memoize((...arr: number[]) => {
  callCount++
  return arr.reduce((a, b) => (a + b), 0)
})

memoizedFn()
memoizedFn(1)
memoizedFn(1)
memoizedFn()
memoizedFn(1, 2, 32409832, 42309743098824, 923784890304)
memoizedFn(1, 2)

console.log('callCount', callCount)
