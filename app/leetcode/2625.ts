type MultiDimensionalArray = (number | MultiDimensionalArray)[]

function flat(arr: MultiDimensionalArray, n: number): MultiDimensionalArray {
  if (n === 0)
    return arr

  if (!arr.some(a => typeof a !== 'number'))
    return arr

  return flat(arr.flat(), --n)
}

// const flatError = function (arr: MultiDimensionalArray, n: number): MultiDimensionalArray {
//   return arr.flat(n)
// }

console.log(flat([1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]], 0))

console.log(flat([1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]], 1))

console.log(flat([1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]], 2))

console.time('b')
console.log(flat(
  [90, [90], [45]],
  999,
))
console.timeEnd('b')
