import process from 'node:process'
import fetch from 'node-fetch'

const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer',
  },
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

function fetchRevisions(): Promise<number> {
  return new Promise((resolve) => {
    fetch('https://admin-prototype.caramaps.org/api/offmaps/66692f65-83e6-4d7f-b77b-3f996a772a3e/revisions', options)
      .then(() => {
        resolve(1)
      })
      .catch(() => {
        resolve(0)
      })
  })
}

(async () => {
  const promises = []

  for (let i = 0; i < 100; i++)
    promises.push(fetchRevisions())

  const values = await Promise.all(promises)

  let success = 0
  let errors = 0

  values.forEach((value) => {
    if (value === 1)
      success++
    else
      errors++
  })

  console.log(`Success: ${success}`)
  console.log(`Errors: ${errors}`)
})()
