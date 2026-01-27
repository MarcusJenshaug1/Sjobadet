import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const nftTarget = '.next/server/middleware.js.nft.json'

if (!existsSync(nftTarget)) {
  mkdirSync(dirname(nftTarget), { recursive: true })
  writeFileSync(nftTarget, JSON.stringify({ version: 1, files: [] }))
  console.log(`[postbuild] Created missing ${nftTarget}`)
}
