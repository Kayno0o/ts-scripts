export { }

declare global {
  interface Array<T> {
    snail(rowsCount: T, colsCount: T): T[][]
  }
}

Array.prototype.snail = function (rowsCount: number, colsCount: number): number[][] {
  if (rowsCount * colsCount !== this.length)
    return []

  const arr: number[][] = []
  for (let i = 0; i < this.length; i++) {
    const x = Math.floor(i / rowsCount)
    const d = x % 2 === 0

    const y = i % rowsCount
    const pos = (d ? y : rowsCount - y - 1)
    arr[pos] ||= []
    arr[pos][x] = this[i]
  }
  return arr
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
console.table(arr.snail(4, 3)) // [[1,2,3,4]]

const arr2 = [19, 10, 3, 7, 9, 8, 5, 2, 1, 17, 16, 14, 12, 18, 6, 13, 11, 20, 4, 15]
console.table(arr2.snail(5, 4)) // [[1,2,3,4]]
