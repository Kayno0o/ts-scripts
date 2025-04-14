import { caesar, vigenereCipher } from '../utils'

const input = 'ZTVGLKDBGLRUHABTUOZ'

for (let s = 0; s < 26; s++) {
  console.log(`${s}: ${caesar(input, s)}`)
}

console.log(vigenereCipher('ZTVGLKDBGLRUHABTUOZ', 'KEY'))
