import * as fs from 'node:fs'
import * as path from 'node:path'
import { JSDOM } from 'jsdom'
import nodefetch from 'node-fetch'

interface TranslationCountry {
  translations: { [lang: string]: string }
}

interface ExportCountry {
  id: number
  alpha2: string
  alpha3: string
  country_code: string
  iso31665: string
  region: string
  sub_region: string
  intermediate_region: string
  region_code: string
  sub_region_code: string
  intermediate_region_code: string

  t_country: Array<{
    translatable_id: number
    locale: string
    name: string
  }>
}

interface Country extends ExportCountry {
  name: string
}

async function fetchHTML() {
  const links: Array<string> = [
    'https://en.wikipedia.org/wiki/List_of_country_names_in_various_languages_(A%E2%80%93C)',
    'https://en.wikipedia.org/wiki/List_of_country_names_in_various_languages_(D%E2%80%93I)',
    'https://en.wikipedia.org/wiki/List_of_country_names_in_various_languages_(J%E2%80%93P)',
    'https://en.wikipedia.org/wiki/List_of_country_names_in_various_languages_(Q%E2%80%93Z)',
  ]

  let html = ''

  for (let i = 0; i < links.length; i++)
    html += await nodefetch(links[i], {}).then((res: any) => res.text())

  fs.writeFileSync(path.join(__dirname, 'links.html'), html)

  return html
}

async function parseHTML() {
  const languages = [
    { name: 'Afrikaans', iso: 'af' },
    { name: 'Albanian', iso: 'sq' },
    { name: 'Arabic', iso: 'ar' },
    { name: 'Armenian', iso: 'hy' },
    { name: 'Azerbaijani', iso: 'az' },
    { name: 'Belarusian', iso: 'be' },
    { name: 'Bengali', iso: 'bn' },
    { name: 'Bulgarian', iso: 'bg' },
    { name: 'Catalan', iso: 'ca' },
    { name: 'Chinese', iso: 'zh' },
    { name: 'Czech', iso: 'cs' },
    { name: 'Danish', iso: 'da' },
    { name: 'Dutch', iso: 'nl' },
    { name: 'Esperanto', iso: 'eo' },
    { name: 'Estonian', iso: 'et' },
    { name: 'Filipino', iso: 'fil' },
    { name: 'Finnish', iso: 'fi' },
    { name: 'French', iso: 'fr' },
    { name: 'Georgian', iso: 'ka' },
    { name: 'German', iso: 'de' },
    { name: 'Greek', iso: 'el' },
    { name: 'Hebrew', iso: 'he' },
    { name: 'Hindi', iso: 'hi' },
    { name: 'Hungarian', iso: 'hu' },
    { name: 'Icelandic', iso: 'is' },
    { name: 'Irish', iso: 'ga' },
    { name: 'Italian', iso: 'it' },
    { name: 'Japanese', iso: 'ja' },
    { name: 'Kazakh', iso: 'kk' },
    { name: 'Korean', iso: 'ko' },
    { name: 'Lithuanian', iso: 'lt' },
    { name: 'Macedonian', iso: 'mk' },
    { name: 'Malay (macr)', iso: 'ms' },
    { name: 'Norwegian', iso: 'no' },
    { name: 'Persian', iso: 'fa' },
    { name: 'Polish', iso: 'pl' },
    { name: 'Portuguese', iso: 'pt' },
    { name: 'Romanian', iso: 'ro' },
    { name: 'Serbo-Croatian', iso: 'sh' },
    { name: 'Slovak', iso: 'sk' },
    { name: 'Spanish', iso: 'es' },
    { name: 'Swedish', iso: 'sv' },
    { name: 'Thai', iso: 'th' },
    { name: 'Turkish', iso: 'tr' },
  ]

  const parsedCountries: { [en: string]: TranslationCountry } = {}

  let html: string | undefined = fs.readFileSync(path.join(__dirname, 'links.html')).toString()

  if (!html) {
    console.log('-- fetching --')
    html = await fetchHTML()
  }

  const dom = new JSDOM(html).window
  const doc = dom.document

  let count = 0

  doc.querySelectorAll('table.wikitable tr').forEach((tr) => {
    const a = tr.querySelector('a[title]')
    if (!a)
      return

    const countryName = a.getAttribute('title')

    if (!countryName)
      return

    count++

    const country: TranslationCountry = {
      translations: {
        en: countryName,
      },
    }

    languages.forEach((lang) => {
      tr.querySelectorAll(`[lang=${lang.iso}]`).forEach((element) => {
        country.translations[lang.iso] = element.textContent || ''
      })
    })

    tr.querySelectorAll('td').forEach((td) => {
      td.querySelectorAll('span[title]').forEach((span) => {
        const regex = new RegExp(`${span.outerHTML}(.*?)?<`)
        const matches = td.innerHTML.match(regex)
        matches?.forEach((match, index) => {
          if (index !== 0)
            return

          const text = span.querySelector('[lang]')?.textContent

          if (!text)
            return

          languages.forEach((lang) => {
            if (!match.includes(lang.name) || country.translations[lang.iso])
              return

            country.translations[lang.iso] = text
          })
        })
      })
    })

    parsedCountries[countryName] = country
  })
  console.log(count)

  fs.writeFileSync(
    path.join(__dirname, 'translations.json'),
    JSON.stringify(parsedCountries, undefined, 2),
  )
}

async function parseCountries() {
  const countries: Array<Country> = JSON.parse(fs.readFileSync(path.join(__dirname, './countries.json')).toString())
  const parsedCountries: {
    [en: string]: TranslationCountry
  } = JSON.parse(fs.readFileSync(path.join(__dirname, './translations.json')).toString())

  const outputCountries: Array<ExportCountry> = []
  const failedCountries: Array<Country> = []

  let count = 1
  let failed = 0

  countries.forEach((country) => {
    if (parsedCountries[country.name]) {
      const translations = Object.entries(
        parsedCountries[country.name].translations,
      ).map(([key, value]) => ({
        translatable_id: count,
        locale: key,
        name: value,
      }))

      const outputCountry: ExportCountry = {
        id: count,
        alpha2: country.alpha2,
        alpha3: country.alpha3,
        country_code: country.country_code,
        iso31665: country.iso31665,
        region: country.region,
        sub_region: country.sub_region,
        intermediate_region: country.intermediate_region,
        region_code: country.region_code,
        sub_region_code: country.sub_region_code,
        intermediate_region_code: country.intermediate_region_code,
        t_country: translations,
      }

      outputCountries.push(outputCountry)

      delete parsedCountries[country.name]

      count++
    }
    else {
      failedCountries.push(country)
      failed++
    }
  })

  fs.writeFileSync(path.join(__dirname, 'exportedCountries.json'), JSON.stringify(outputCountries, undefined, 2))
  fs.writeFileSync(path.join(__dirname, 'failedCountries.json'), JSON.stringify(failedCountries, undefined, 2))
  fs.writeFileSync(path.join(__dirname, 'failedTranslations.json'), JSON.stringify(parsedCountries, undefined, 2))

  console.log('failed', failed)
}

function nullableString(str: string) {
  if (str === 'NULL')
    return 'NULL'

  return `'${str}'`
}

function SQLcountries() {
  const countries: Array<ExportCountry> = JSON.parse(fs.readFileSync(path.join(__dirname, './exportedCountries.json')).toString())

  const countriesSQL = `INSERT INTO country(id, alpha2, alpha3, country_code, iso31665, region, sub_region, intermediate_region, region_code, sub_region_code, intermediate_region_code)\nVALUES (${[
    countries
      .map(
        c =>
          `${c.id}, '${c.alpha2}', '${c.alpha3}', ${c.country_code}, '${c.iso31665
          }', '${c.region}', '${c.sub_region}', ${nullableString(
            c.intermediate_region,
          )}, ${c.region_code}, ${c.sub_region_code}, ${c.intermediate_region_code
          }`,
      )
      .join('),\n       ('),
  ]})`

  const translationsSQL = `INSERT INTO t_country(translatable_id, locale, name)\nVALUES (${countries
    .map(c =>
      c.t_country
        .map(t => `${t.translatable_id}, '${t.locale}', \`${t.name}\``)
        .join('),\n       ('),
    )
    .join('),\n       (')})`

  fs.writeFileSync(
    path.join(__dirname, 'countries.sql'),
    `CREATE TABLE country
(
    id                       INTEGER PRIMARY KEY AUTO_INCREMENT,
    alpha2                   VARCHAR(2)   NOT NULL,
    alpha3                   VARCHAR(3)   NOT NULL,
    country_code             INTEGER,
    iso31665                 VARCHAR(13),
    region                   VARCHAR(8),
    sub_region               VARCHAR(32),
    intermediate_region      VARCHAR(16),
    region_code              INTEGER,
    sub_region_code          INTEGER,
    intermediate_region_code INTEGER
);

CREATE TABLE t_country
(
    id              INTEGER PRIMARY KEY AUTO_INCREMENT,
    translatable_id INT,
    locale          CHAR(2),
    name            VARCHAR(255),
    FOREIGN KEY (translatable_id) REFERENCES country (id)
);\n\n${
    countriesSQL
    }\n\n${
    translationsSQL}`,
  )
}

(async () => {
  // await parseHTML()
  await parseCountries()
  SQLcountries()
})()
