import { colors } from '@kaynooo/utils'

const text = `
THSWQD THZ RBXP GWXP HG XL ZWRNBRHK UTPQ WQ KBQZBQ,
W THZ SWRWGPZ GTP IOWGWRT XMRPMX, HQZ XHZP RPHOFT
HXBQD GTP IBBVR HQZ XHNR WQ GTP KWIOHOL OPDHOZWQD
GOHQRLKSHQWH; WG THZ RGOMFV XP GTHG RBXP ABOPVQBUKPZDP
BA GTP FBMQGOL FBMKZ THOZKL AHWK GB THSP RBXP WXNBOGHQFP
WQ ZPHKWQD UWGT H QBIKPXHQ BA GTHG FBMQGOL.

GOHQRLKSHQWH
`

let output = ''

const data: Record<string, string> = {
  A: 'f',
  B: 'o', // !
  C: '',
  D: 'g', // !
  E: '',
  F: 'c',
  G: 't', // !
  H: 'a', // !
  I: 'b',
  J: '',
  K: 'l',
  L: 'y',
  M: 'u',
  N: 'p',
  O: 'r',
  P: 'e', // !
  Q: 'n',
  R: 's', // !
  S: 'v',
  T: 'h', // !
  U: 'w',
  V: 'k',
  W: 'i', // !
  X: 'm',
  Y: '',
  Z: 'd', // !
}

for (const c of text) {
  output += data[c] ? colors.green(data[c]) : colors.red(c)
}

console.log(output)
