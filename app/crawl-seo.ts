import { URL } from 'node:url'
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

const visitedPages = new Set()
let crawlUrl = 'http://localhost:3000'
const baseUrl = new URL(crawlUrl)

let ignoreRobots = false
let ignorePages = []

const args = process.argv.slice(2)

for (const arg of args) {
  const [key, value] = arg.split('=')
  if (key === '--url')
    crawlUrl = value
  if (key === '--ignoreRobots')
    ignoreRobots = true
  if (key === '--ignore')
    ignorePages = value.split(',')

  if (key === '--help') {
    console.log('Usage: crawl-seo.js [--url=URL] [--ignoreRobots] [--ignore=PAGE1,PAGE2]')
    process.exit(0)
  }
}

async function crawl(url: string) {
  const normalizedUrl = new URL(url, baseUrl)
  const href = normalizedUrl.href

  if (visitedPages.has(href) || href.match(/\.[a-z]+$/))
    return

  visitedPages.add(href)

  if (!href.startsWith(crawlUrl))
    return

  try {
    const response = await fetch(href)
    if (!response.ok) {
      console.error(`${href}: Failed to fetch ${response.status}`)
      return
    }

    const html = await response.text()
    const { window } = new JSDOM(html, { contentType: 'text/html', url: href })
    const { document } = window

    const images = document.querySelectorAll('img')
    for (const image of images) {
      const alt = image.getAttribute('alt')
      if (!alt)
        console.error(`${href}: Image ${image.src} is missing alt text\n  - classes: ${image.className}`)
    }

    if (!ignoreRobots) {
      if (document.querySelector('meta[name="robots"][content*="noindex"]'))
        return
      if (document.querySelector('meta[name="robots"][content*="nofollow"]'))
        return
    }

    for (const page of ignorePages) {
      if (href.startsWith(new URL(page, baseUrl).href))
        return
    }

    if (!document.querySelector('h1'))
      console.error(`${href}: Missing h1 tag`)

    if (!document.querySelector('title'))
      console.error(`${href}: Missing title tag`)

    if (!document.querySelector('meta[name="description"]'))
      console.error(`${href}: Missing meta description tag`)

    if (!document.querySelector('meta[property="og:title"]'))
      console.error(`${href}: Missing og:title tag`)

    if (!document.querySelector('meta[property="og:description"]'))
      console.error(`${href}: Missing og:description tag`)

    if (!document.querySelector('meta[property="og:image"]'))
      console.error(`${href}: Missing og:image tag`)

    if (!document.querySelector('meta[property="og:url"]'))
      console.error(`${href}: Missing og:url tag`)

    if (href.includes('_'))
      console.error(`Page ${href} has underscores in the url`)

    const externalLinks = document.querySelectorAll('a[href^="http"]')
    for (const link of externalLinks) {
      const rel = link.getAttribute('rel')
      if (!rel || !(rel.includes('nofollow') || rel.includes('noreferrer') || rel.includes('noopener')))
        console.error(`${href}: ${link.href} has no rel="nofollow|noreferer|noopener"\n  - classes: ${link.className}`)
    }

    const links = document.querySelectorAll('a')
    for (const link of links) {
      const href = link.getAttribute('href')

      if (href && !href.startsWith('#') && !href.startsWith('javascript:'))
        await crawl(new URL(href, normalizedUrl).href)
    }

    window.close()
  }
  catch (error) {
    console.error(`${href}: Failed to crawl`)
  }
}

crawl(baseUrl.href)
