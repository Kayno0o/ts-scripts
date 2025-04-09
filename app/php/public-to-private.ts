import fs from 'node:fs'
import path from 'node:path'

const ENTITY_DIR = path.join(import.meta.dir, 'src', 'Entity')

// Capture optional `?`, the type, and property name
const PROPERTY_REGEX = /public\s+(\??)(?!DateTime|Collection)([A-Z]\w+)\s+\$(\w+)(?:\s*=\s*null)?;/g

function readPhpFilesRecursively(dir: string): string[] {
  let files: string[] = []

  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files = files.concat(readPhpFilesRecursively(fullPath))
    }
    else if (fullPath.endsWith('.php')) {
      files.push(fullPath)
    }
  }

  return files
}

function methodExists(content: string, methodName: string): boolean {
  const methodRegex = new RegExp(`function\\s+${methodName}\\s*\\(`, 'i')
  return methodRegex.test(content)
}

function generateGetterSetter(nullable: string, type: string, name: string, content: string): string {
  const methodName = name.charAt(0).toUpperCase() + name.slice(1)
  const getter = `get${methodName}`
  const setter = `set${methodName}`
  const methods: string[] = []

  if (!methodExists(content, getter)) {
    methods.push(`
  public function ${getter}(): ${nullable}${type}
  {
      return \$this->${name};
  }`)
  }

  if (!methodExists(content, setter)) {
    methods.push(`
  public function ${setter}(${nullable}${type} \$${name}): self
  {
      \$this->${name} = \$${name};
      return \$this;
  }`)
  }

  return methods.join('\n')
}

function transformProperties(content: string): string {
  const matches = [...content.matchAll(PROPERTY_REGEX)]
  let modified = content
  const generatedMethods: string[] = []

  for (const match of matches) {
    const [fullMatch, nullable, type, name] = match

    // Replace `public` with `private`
    const replacement = fullMatch.replace('public', 'private')
    modified = modified.replace(fullMatch, replacement)

    // Append generated methods if needed
    const generated = generateGetterSetter(nullable, type, name, modified)
    if (generated.trim()) {
      generatedMethods.push(generated)
    }
  }

  if (generatedMethods.length > 0) {
    modified = modified.replace(/\n\}\s*$/, `\n${generatedMethods.join('\n')}\n}`)
  }

  return modified
}

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8')
  const originalContent = content
  content = transformProperties(content)

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`Updated: ${path.relative(import.meta.dir, filePath)}`)
  }
}

function main() {
  const files = readPhpFilesRecursively(ENTITY_DIR)

  for (const file of files) {
    processFile(file)
  }
}

main()
