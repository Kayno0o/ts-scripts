const A = 65
const S = 26

export function caesar(input: string, shift: number) {
  return input.split('').map((c) => {
    const x = c.charCodeAt(0)
    return (x >= A && x < A + S)
      ? String.fromCharCode(A + (x - A + shift) % S)
      : c
  }).join('')
}

export function vigenereCipher(input: string, key: string) {
  let output = ''
  let keyIndex = 0

  for (const c of input) {
    const x = c.charCodeAt(0)

    if (x >= A && x < A + S) {
      const keyChar = key[keyIndex % key.length]
      const keyShift = keyChar.charCodeAt(0) - A
      const shifted = (x - A + keyShift) % S
      output += String.fromCharCode(A + shifted)
      keyIndex++
    }
    else {
      output += c
    }
  }

  return output
}
