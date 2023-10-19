type Fn = (...params: any) => any

function memoize(fn: Fn): Fn {
  const cache: Map<string, any> = new Map()

  return function (...args) {
    const key = args.join(',')

    if (!cache.has(key))
      cache.set(key, fn(...args))

    return cache.get(key)
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
memoizedFn(1, 2, 32409832, 42309743098824, 923784890304)
memoizedFn(1, 2)

console.log('callCount', callCount)
