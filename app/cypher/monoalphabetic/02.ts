import { colors } from '@kaynooo/utils'

const input = `
LGGK VHZXJ RP VJJCEVO CK ZMX MGEXO C SCLDGEXJXS
LGRX IVIXJL CK ZMX IGDQXZ GH ZMX SJXLL UMCDM C MVS
ZVQXK HJGR PGBJ OVWGJVZGJP. VZ HCJLZ C MVS
KXNOXDZXS ZMXR, WBZ KGU ZMVZ C UVL VWOX ZG SXDCIMXJ
ZMX DMVJVDZXJL CK UMCDM ZMXP UXJX UJCZZXK, C
WXNVK ZG LZBSP ZMXR UCZM SCOCNXKDX.

OVWGJVZGJP
`
const data: Record<string, string> = {
  A: '',
  B: 'u',
  C: 'i',
  D: 'c',
  E: 'v',
  F: '',
  G: 'o',
  H: 'f',
  I: 'p',
  J: 'r',
  K: 'n',
  L: 's',
  M: 'h', // !
  N: 'g',
  O: 'l',
  P: 'y',
  Q: 'k',
  R: 'm',
  S: 'd',
  T: 'u',
  U: 'w',
  V: 'a', // !
  W: 'b',
  X: 'e', // !
  Y: '',
  Z: 't', // !
}

console.log('From:')
console.log(input)

let output = ''
for (const c of input) {
  output += data[c] ? colors.green(data[c]) : colors.red(c)
}

console.log('To:')
console.log(output)
