const input = 'LGGK VHZXJ RP VJJCEVO CK ZMX MGEXO C SCLDGEXJXS LGRX IVIXJL CK ZMX IGDQXZ GH ZMX SJXLL UMCDM C MVS ZVQXK HJGR PGBJ OVWGJVZGJP'
const prompt = 'OVWGJVZGJP'

const data: Record<string, number> = {
  A: 0,
  B: 3,
  C: 18,
  D: 9,
  E: 3,
  F: 0,
  G: 14,
  H: 4,
  I: 4,
  J: 16,
  K: 10,
  L: 10,
  M: 18,
  N: 3,
  O: 6,
  P: 5,
  Q: 2,
  R: 5,
  S: 9,
  T: 0,
  U: 7,
  V: 16,
  W: 4,
  X: 29,
  Y: 0,
  Z: 24,
}

console.log('From:')
console.log(input)

let output = ''
for (const c of input) {
  if (!data[c]) {
    output += c
    continue
  }

  const letter = (data[c] % 26) + 97
  output += String.fromCharCode(letter)
}

console.log('To:')
console.log(output)
