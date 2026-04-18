/**
 * Downloads all 116 Webflow CDN assets to /public/assets/
 * Run: npx tsx scripts/download-assets.ts
 *
 * Features:
 * - Parallel downloads (concurrency: 10)
 * - Skip already downloaded files
 * - Verify file size after download
 * - Progress logging
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const ROOT = path.join(__dirname, '..')
const ASSETS_JSON = path.join(
  ROOT, '..', 'webflow-export', 'full', 'growdient-ebea65', 'assets', 'all_assets.json'
)
const OUTPUT_DIR = path.join(ROOT, 'public', 'assets')

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

interface WebflowAsset {
  id: string
  displayName: string
  contentType: string
  size: number
  hostedUrl: string
}

const assets: WebflowAsset[] = JSON.parse(fs.readFileSync(ASSETS_JSON, 'utf-8'))

function downloadFile(url: string, dest: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        downloadFile(res.headers.location!, dest).then(resolve).catch(reject)
        return
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }
      res.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(fs.statSync(dest).size)
      })
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(dest)) fs.unlinkSync(dest)
      reject(err)
    })
  })
}

async function processAsset(asset: WebflowAsset): Promise<string> {
  const dest = path.join(OUTPUT_DIR, asset.displayName)

  if (fs.existsSync(dest)) {
    const existingSize = fs.statSync(dest).size
    if (existingSize === asset.size) {
      return `SKIP  ${asset.displayName}`
    }
  }

  try {
    const downloadedSize = await downloadFile(asset.hostedUrl, dest)
    const sizeMatch = downloadedSize === asset.size ? '✓' : '≈'
    return `OK ${sizeMatch} ${asset.displayName} (${downloadedSize} bytes)`
  } catch (err) {
    return `FAIL  ${asset.displayName}: ${err instanceof Error ? err.message : String(err)}`
  }
}

async function main() {
  const CONCURRENCY = 10
  const results: string[] = []
  let processed = 0

  for (let i = 0; i < assets.length; i += CONCURRENCY) {
    const batch = assets.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.all(batch.map(processAsset))
    results.push(...batchResults)
    processed += batch.length
    console.log(`Progress: ${processed}/${assets.length}`)
  }

  console.log('\n── Results ──')
  results.forEach((r) => console.log(r))

  const ok = results.filter((r) => r.startsWith('OK')).length
  const skip = results.filter((r) => r.startsWith('SKIP')).length
  const fail = results.filter((r) => r.startsWith('FAIL')).length
  console.log(`\n✅ Done: ${ok} downloaded, ${skip} skipped, ${fail} failed`)
}

main().catch(console.error)
