import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

interface PhpStanError {
  filePath: string
  line: number
  message: string
}

// Run phpstan and parse output
function runPhpStan(): PhpStanError[] {
  const rawOutput = execSync('make phpstan', { encoding: 'utf-8' })
  const lines = rawOutput.split('\n')

  const errors: PhpStanError[] = []

  for (const line of lines) {
    const match = line.match(/^(.+\.php):(\d+):Access to private property (.+)::\$(\w+)\.$/)
    if (match) {
      const [, filePath, lineStr, , property] = match
      errors.push({
        filePath: path.resolve(filePath.trim()),
        line: Number.parseInt(lineStr.trim(), 10),
        message: property.trim(),
      })
    }
  }

  return errors
}

// Convert camelCase to PascalCase
function toPascalCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// Replace property access with getter
function fixFile(filePath: string, fixes: { line: number, property: string }[]) {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n')
  let changed = false

  for (const { line, property } of fixes) {
    const idx = line - 1
    const readRegex = new RegExp(`->${property}(?!\\s*=(?!=)|\\s*\\()\\b`)
    const writeRegex = new RegExp(`->${property}\\s*=\\s*([^;]+);`)
    const pascal = toPascalCase(property)

    if (readRegex.test(lines[idx])) {
      lines[idx] = lines[idx].replace(readRegex, `->get${pascal}()`)
      changed = true
      console.log(`✔ Fixed read of ${property} at ${path.relative(import.meta.dir, filePath)}:${line}`)
      continue
    }

    if (writeRegex.test(lines[idx])) {
      lines[idx] = lines[idx].replace(writeRegex, (_match, value) => {
        return `->set${pascal}(${value.trim()});`
      })
      changed = true
      console.log(`✔ Fixed assignment to ${property} at ${path.relative(import.meta.dir, filePath)}:${line}`)
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
  }
}

function groupFixesByFile(errors: PhpStanError[]): Record<string, { line: number, property: string }[]> {
  const map: Record<string, { line: number, property: string }[]> = {}

  for (const err of errors) {
    map[err.filePath] ??= []
    map[err.filePath].push({ line: err.line, property: err.message })
  }

  return map
}

function main() {
  const errors = runPhpStan()
  const fileFixes = groupFixesByFile(errors)

  for (const [filePath, fixes] of Object.entries(fileFixes)) {
    fixFile(filePath, fixes)
  }
}

main()
