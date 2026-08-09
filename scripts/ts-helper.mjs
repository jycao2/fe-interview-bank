import fs from 'fs'
import path from 'path'
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:\/)/, '$1')), '..')
const filePath = path.join(root, 'src/data/typescript.js')
const insertFile = path.join(root, 'scripts/drafts/ts-insert.txt')
const content = fs.readFileSync(filePath, 'utf8')
const insert = fs.readFileSync(insertFile, 'utf8')
const idx = content.lastIndexOf('\n]\n')
if (idx === -1) { console.error('closing ] not found'); process.exit(1) }
const result = content.slice(0, idx) + ',\n' + insert + '\n' + content.slice(idx + 1)
fs.writeFileSync(filePath, result, 'utf8')
console.log('Done. New length:', result.length)
