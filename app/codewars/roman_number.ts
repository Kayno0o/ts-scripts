function solution(n: number): string {
  if (n <= 0)
    return ''

  let r = ''

  const v: [string, number][] = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]]
  const l = v.length
  for (let i = 0; i < l; i++) {
    const [k, nb] = v[i]
    while (n >= nb) {
      n -= nb
      r += k
    }
  }
  return r
}

// console.time('roman')
// for (let i = 0; i < 10000000; i++)
//   solution(randomInt(2000))

// console.timeEnd('roman')

console.log(solution(182), 'CLXXXII')
console.log(solution(1990), 'MCMXC')
console.log(solution(1875), 'MDCCCLXXV')
console.log(solution(1463), 'MCDLXIII')
