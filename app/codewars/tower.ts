function tower(n: number): Array<string> {
  const res: Array<string> = []

  for (let i = 0; i < n; i++) {
    const spacing = ' '.repeat(n - 1 - i)
    const stars = '*'.repeat(i * 2 + 1)
    res.push(`${spacing}${stars}${spacing}`)
  }

  return res
}

console.log(tower(1))
console.log(tower(3))
console.log(tower(6))
