import { vigenereCipher } from '../utils'

const input = 'JCWSVLIVLVGSJJFJCWCVL'
const key = 'AAT'

const output = vigenereCipher(input, key)
console.log(output)
