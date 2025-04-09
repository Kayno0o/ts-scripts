import { colors } from '@kaynooo/utils'

const input = `
UOIKI -Y IVIK . =/.N O!NIVIK -L UOI MIYU /.-| !=
OTZ.L ♢/.LY .L| UOI ZTK|IKIKY != ▣!OL !♢ILYO.N NIKI
LIVIK U! KI▫I-VI UOI !K.LAI ♢-♢Y NO-▫O N!T/| YO!N UOIZ
UO.U .L!UOIK .U ▫TLL-LA .L| .Y KIY!/TUI .Y UOIZYI/VIY
N.Y T♢!L UOI-K UK.▫H VIK: /!LA .L| VIK: YIVIKI NIKI UOI
I]T-L!▫U-./ A./IY UO.U :I.K NI N.-UI| /!LA =!K LINY
!= UOI /!LI YU.K != Y.V.LL.O MTU L!LI IVIK KI.▫OI| TY

/!LI YU.K
`

const data: Record<string, string> = {
  'U': 't',
  'O': 'h',
  'I': 'e',
  'K': 'r',
  '.': 'a',
  '-': 'i',
  'Y': 's',
  'V': 'v',
  '=': 'f',
  '/': 'l',
  'N': 'w',
  '!': 'o',
  'L': 'n',
  'M': 'b',
  '|': 'd',
  'T': 'u',
  'Z': 'm',
  '♢': 'p',
  '▣': 'j',
  '▫': 'c',
  'A': 'g',
  'H': 'k',
  ':': 'y',
  ']': 'q',
}

console.log('From:')
console.log(input)

let output = ''
for (const c of input) {
  if (!(c in data)) {
    output += colors.bold(colors.magenta(c)) + colors.reset('')
    continue
  }

  output += data[c] ? colors.green(data[c]) : colors.red(c)
}

console.log('To:')
console.log(output)
