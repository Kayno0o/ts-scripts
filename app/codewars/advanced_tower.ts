function advancedTower(nFloors: number, nBlockSz: [number, number]): Array<string> {
  const [bw, bh] = nBlockSz
  const res: Array<string> = []

  for (let i = 0; i < nFloors; i++) {
    const spacing = ' '.repeat((nFloors - 1 - i) * bw)
    const stars = '*'.repeat((i * 2 + 1) * bw)

    for (let h = 0; h < bh; h++) res.push(`${spacing}${stars}${spacing}`)
  }

  return res
}

console.log(advancedTower(1, [2, 1]))
console.log(advancedTower(1, [2, 3]))
console.log(advancedTower(3, [2, 3]))
