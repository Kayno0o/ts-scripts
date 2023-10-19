type F2629 = (x: number) => number

function compose(functions: F2629[]): F2629 {
  return function (x) {
    const l = functions.length
    for (let i = l - 1; i >= 0; i--)
      x = functions[i](x)
    return x
  }
}

const fn = compose([x => x + 1, x => 2 * x])
console.log(fn(4))
