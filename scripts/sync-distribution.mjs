import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distPath = resolve(projectRoot, 'dist')
const docsPath = resolve(projectRoot, 'docs')

if (!existsSync(distPath)) {
  throw new Error('dist directory does not exist. Run npm run build first.')
}

rmSync(docsPath, { recursive: true, force: true })
mkdirSync(docsPath, { recursive: true })
cpSync(distPath, docsPath, { recursive: true })
writeFileSync(resolve(docsPath, '.nojekyll'), '')

console.log(`[distribution] synced ${distPath} to ${docsPath}`)
