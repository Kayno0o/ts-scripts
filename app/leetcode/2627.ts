type F2627 = (...args: any[]) => void

function debounce(fn: F2627, t: number): F2627 {
  let timeout: NodeJS.Timeout

  return function (...args) {
    clearTimeout(timeout)

    timeout = setTimeout(() => fn(...args), t)
  }
}

const log = debounce(console.log, 100)
log('Hello') // cancelled
log('Hello') // cancelled
log('Hello') // Logged at t=100ms
