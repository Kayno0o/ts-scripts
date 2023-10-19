type Digit = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

function letterCombinations(digits: string): string[] {
  const pad: { [key in Digit]: Array<string> } = {
    2: ['a', 'b', 'c'],
    3: ['d', 'e', 'f'],
    4: ['g', 'h', 'i'],
    5: ['j', 'k', 'l'],
    6: ['m', 'n', 'o'],
    7: ['p', 'q', 'r', 's'],
    8: ['t', 'u', 'v'],
    9: ['w', 'x', 'y', 'z'],
  }

  function combine(arr1: Array<string>, arr2: Array<string>): Array<string> {
    const o: Array<string> = []
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++)
        o.push(arr1[i] + arr2[j])
    }
    return o
  }

  const args = digits.split('') as Array<Digit>
  let o: Array<string> = pad[args[0]] || []
  for (let i = 1; i < args.length; i++)
    o = combine(o, pad[args[i]])

  return o
}

console.log(letterCombinations('23'))
console.log(letterCombinations('2'))
