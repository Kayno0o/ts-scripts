function reduce(nums: number[], fn: (accum: number, curr: number) => number, init: number): number {
  return nums.reduce(fn, init)
}

console.log(
  reduce(
    [1, 2, 3, 4],
    (acc, curr) => acc + curr,
    0,
  ),
)
