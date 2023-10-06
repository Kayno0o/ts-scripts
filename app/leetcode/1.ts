const twoSum = function (nums: Array<number>, target: number) {
  for (let i = 0; i < nums.length; i++) {
    const element = nums[i]
    const index = nums.indexOf(target - element)
    if (index > -1 && index !== i)
      return [i, index]
  }
}

console.log(twoSum([9, 7, 2, 11, 15], 9))
