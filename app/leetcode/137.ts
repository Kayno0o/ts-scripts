function singleNumber(nums) {
  const a = new Map()
  for (let i = 0; i < nums.length; i++) {
    if (!a.has(nums[i]))
      a.set(nums[i], 1)
    else a.set(nums[i], 2)
  }
  for (let i = 0; i < nums.length; i++) {
    if (a.get(nums[i]) === 1)
      return nums[i]
  }
}

console.log(singleNumber([2, 2, 3, 2]))
console.log(singleNumber([0, 1, 0, 1, 0, 1, 99]))
