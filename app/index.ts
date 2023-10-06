import process from 'node:process'
import fetch from 'node-fetch'

const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2MGI5ZGUwODBmZmFmYmZjMTgzMzllY2Q0NGFjNzdmN2ZhNGU4ZDMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW50b2luZSBFUlJBTkRPTkVBIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2NhcmFtYXBzMjAyMyIsImF1ZCI6ImNhcmFtYXBzMjAyMyIsImF1dGhfdGltZSI6MTY5MzMyMDQ0MSwidXNlcl9pZCI6IlBUSEJzYm5KV2NaRnBVcU91Z1VvNkJZaWJ4YTIiLCJzdWIiOiJQVEhCc2JuSldjWkZwVXFPdWdVbzZCWWlieGEyIiwiaWF0IjoxNjkzMzIwNDQxLCJleHAiOjE2OTMzMjQwNDEsImVtYWlsIjoiYW50b2luZS5lcnJhbmRvbmVhQGF0aG9tZS1zb2x1dGlvbi5mciIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbnRvaW5lLmVycmFuZG9uZWFAYXRob21lLXNvbHV0aW9uLmZyIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.TI8MFVtOjN2mL6pmcVTqPl_EX_Za1Jg2On6OSxwOTmr09MlU9NrCq8JL5m7OqY26LX7mYrZqXyRQH7ZaKc1bQwuiINdfQ8uW9OlGQ_fDxKfLudf6KX4BRaTldNrvUbfSXeiWuoSVzaZdWqKsH3DFQpcFMv7n6RncBhpeQH7PgsYIl_TZ4uceqQfAjXmndPnBW3Tzqp8iZ5nitYH2DfltN7GYs8no27CtrXy16DNGnNdKSEZWWL2hjgvquHCJcqaui6lukuougSx7Ra3v-AgI7qorIDYfO4VIoCQmYuVjv67vPzPnGVeSDUDO2_VJ7zdzoOLhHWcM9FDFnr4Eb7wQ9A',
  },
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

function fetchRevisions(): Promise<number> {
  return new Promise((resolve) => {
    fetch('https://admin-prototype.caramaps.org/api/offmaps/66692f65-83e6-4d7f-b77b-3f996a772a3e/revisions', options)
      .then(() => {
        resolve(1)
      }).catch(() => {
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
