async function sleep(millis) {
  return new Promise(resolve => setTimeout(() => resolve(millis), millis))
}

(async () => {
  console.log(await sleep(100))
})()
