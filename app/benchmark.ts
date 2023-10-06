const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

// function a(length) {
//   return Array.from({ length }, () => alphabet.charAt(Math.floor(Math.random() * alphabet.length))).reduce((a, b) => a + b, '')
// }

function b(length) {
  const b = []
  for (let i = 0; i < length; i++)
    b[i] = alphabet.charAt(Math.floor(Math.random() * alphabet.length))

  return b.join('')
}

function c(length) {
  let b = ''
  for (let i = 0; i < length; i++)
    b += alphabet.charAt(Math.floor(Math.random() * alphabet.length))

  return b
}

console.time('b')
for (let i = 0; i < 10000; i++) {
  b(10000)
  b(10)
}
console.timeEnd('b')

console.time('c')
for (let i = 0; i < 10000; i++) {
  c(10000)
  c(10)
}
console.timeEnd('c')
