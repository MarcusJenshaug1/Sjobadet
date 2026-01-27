import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const nftTarget = '.next/server/middleware.js.nft.json'
const middlewareTarget = '.next/server/middleware.js'

if (!existsSync(nftTarget)) {
  mkdirSync(dirname(nftTarget), { recursive: true })
  writeFileSync(nftTarget, JSON.stringify({ version: 1, files: [] }))
  console.log(`[postbuild] Created missing ${nftTarget}`)
}

if (!existsSync(middlewareTarget)) {
  mkdirSync(dirname(middlewareTarget), { recursive: true })
  writeFileSync(middlewareTarget, 'module.exports = {}\n')
  console.log(`[postbuild] Created missing ${middlewareTarget}`)
}
