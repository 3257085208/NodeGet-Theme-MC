import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
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

for (const name of readdirSync(distPath)) {
  if (name.endsWith('.zip')) continue
  cpSync(resolve(distPath, name), resolve(docsPath, name), { recursive: true })
}

writeFileSync(resolve(docsPath, '.nojekyll'), '')

console.log(`[distribution] synced ${distPath} to ${docsPath}`)
