function containsDuplicate(nums: number[]): boolean {
  return nums.some((v, i, a) => a.indexOf(v) !== i)
}
function containsDuplicateBis(nums: number[]): boolean {
  const s = new Set(nums)
  return s.size !== nums.length
}

console.log(containsDuplicate([1, 2, 1, 3, 4, 3, 5]))
console.log(containsDuplicate([1, 2, 3, 4, 5]))
console.log(containsDuplicateBis([1, 2, 1, 3, 4, 3, 5]))
console.log(containsDuplicateBis([1, 2, 3, 4, 5]))
