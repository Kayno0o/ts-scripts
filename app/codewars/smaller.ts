import { deepEquals } from 'bun'

function smaller(nums: number[]): number[] {
  const dic: Record<number, number> = {}
  const arr: number[] = []

  for (let i = nums.length - 1; i >= 0; i--) {
    const n: number = nums[i]

    dic[n] ||= 0

    const v = Object.keys(dic).reduce((acc, curr) => (Number(curr) < n ? (acc += dic[Number(curr)]) : acc), 0)

    arr.unshift(v)

    dic[n]++
  }

  return arr
}

const arr: number[] = []

for (let i = 0; i < 10000; i++)
  arr.push(Math.floor(Math.random() * 1000))

console.time('time')

smaller(arr)

console.timeEnd('time')

console.log(deepEquals(smaller([5, 4, 3, 2, 1]), [4, 3, 2, 1, 0]))
console.log(deepEquals(smaller([1, 2, 3]), [0, 0, 0]))
console.log(deepEquals(smaller([1, 2, 0]), [1, 1, 0]))
console.log(deepEquals(smaller([1, 2, 1]), [0, 1, 0]))
console.log(deepEquals(smaller([1, 1, -1, 0, 0]), [3, 3, 0, 0, 0]))
