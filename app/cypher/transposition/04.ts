const input = `
SNEJDGN
TTEXARO
NEXXTDA
IXXNHHE
ANRTOIE
SSXORXD
ASSEUUO
`.trim()

const chars = input.split('\n').map(line => line.split(''))

let output = ''

for (let i = 0; i < chars.length + chars[0].length - 1; i++) {
  let y = Math.max(0, (chars.length - 1) - i)
  let x = Math.max(0, i - (chars[0].length - 1))

  do {
    output += chars[y][x]
    x++
    y++
  } while (x < chars[0].length && y < chars.length)
}

console.log(output.replaceAll('X', ' '))
