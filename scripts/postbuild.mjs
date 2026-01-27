import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const target = '.next/server/middleware.js.nft.json'

if (!existsSync(target)) {
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, JSON.stringify({ version: 1, files: [] }))
  console.log(`[postbuild] Created missing ${target}`)
}
