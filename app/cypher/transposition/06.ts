const input = 'TEAUYUOSHNNTRRBTEPAIENROMLMNTTIL'

const partsCount = 4

let output = ''
for (let i = 0; i < input.length; i++) {
  const row = Math.floor(i / partsCount)
  const col = i % partsCount
  output += input[row + col * input.length / partsCount]
}

console.log(output)
