function isPalindrome(x: number): boolean {
  if (x < 0)
    return false
  let digits: number
  if (x === 0)
    digits = 1
  else digits = Math.floor(Math.log10(x)) + 1

  for (let i = 0; i < digits / 2; i++) {
    const left = Math.floor(x / 10 ** (digits - i - 1)) % 10
    const right = Math.floor(x / 10 ** i) % 10
    if (left !== right)
      return false
  }

  return true
}

console.time('isPalindrome')
console.log(isPalindrome(121))
console.log(isPalindrome(1255553555521))
console.log(isPalindrome(-121))
console.log(isPalindrome(10))
console.log(isPalindrome(1))
console.log(isPalindrome(0))
console.timeEnd('isPalindrome')
