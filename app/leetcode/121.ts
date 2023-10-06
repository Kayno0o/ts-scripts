function maxProfit(prices: number[]): number {
  let max = 0
  let sum = 0
  for (let i = 0; i < prices.length - 1; i++) {
    sum += prices[i + 1] - prices[i]
    if (sum < 0)
      sum = 0
    if (sum > max)
      max = sum
  }

  return max
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]))
console.log(maxProfit([7, 6, 4, 3, 1]))
