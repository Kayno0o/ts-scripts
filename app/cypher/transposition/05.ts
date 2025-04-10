const input = 'QRTSQEKIQDTAQNWA'.replace(/^Q|Q$/g, '')

const output = input.split('Q').map(part => part.split('').reverse().join('')).join('')

console.log(output)
