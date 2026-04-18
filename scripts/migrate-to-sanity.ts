/**
 * Migration script: JSON → Sanity (with images from CDN)
 * Run: npx tsx scripts/migrate-to-sanity.ts
 *
 * Requires SANITY_API_TOKEN in .env.local
 * Get token at: https://sanity.io/manage → project → API → Tokens → Add API Token (Editor)
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach((line) => {
      const [key, ...vals] = line.split('=')
      if (key && vals.length) process.env[key.trim()] = vals.join('=').trim().replace(/^"|"$/g, '')
    })
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-04-18',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const CATEGORY_LABELS: Record<string, string> = {
  '045272695e1850b182d0a873052a3ff6': 'Branding Strategy',
  'f48b61242d6508f83d6ab58bf883e0f6': 'AI in Design',
  'cc3d76279f339d2a6c049c566bc5c5a5': 'Design Services',
  '742389aea11fb32c9dbd0a935ce9c030': 'Web Development',
  '53b9e8a15cc901afcae7ac48f9a93ff4': 'Web & UI/UX',
  'ae9365d9fe8e15c5739db075915e88fd': 'Naming & Positioning',
  '0652cf3d5caa55e51c9ec589581e5785': 'Logo Design',
  'd06d2a7baeb96150ab93cf8cac25c184': 'Brand Identity',
}

// ─── Image upload ─────────────────────────────────────────────────────────────

// Cache url → assetId to avoid re-uploading the same image
const uploadCache = new Map<string, string>()

function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location!).then(resolve).catch(reject)
      }
      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function mimeFromUrl(url: string): string {
  if (url.includes('.gif')) return 'image/gif'
  if (url.includes('.png')) return 'image/png'
  if (url.includes('.webp')) return 'image/webp'
  return 'image/jpeg'
}

async function uploadImage(url: string): Promise<string | null> {
  if (uploadCache.has(url)) {
    console.log(`    ↩ reusing ${url.split('/').pop()}`)
    return uploadCache.get(url)!
  }
  try {
    console.log(`    ↑ ${url.split('/').pop()}`)
    const buffer = await fetchBuffer(url)
    const asset = await client.assets.upload('image', buffer, {
      contentType: mimeFromUrl(url),
      filename: url.split('/').pop()?.split('?')[0] ?? 'image.jpg',
    })
    uploadCache.set(url, asset._id)
    return asset._id
  } catch (err) {
    console.error(`    ✗ failed: ${url}`, err)
    return null
  }
}

function imageRef(assetId: string, alt = '') {
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt,
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

async function migrateProjects() {
  const raw = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/projects.json'), 'utf8')
  )

  for (const p of raw) {
    console.log(`\n📁 ${p.name}`)

    const existing = await client.fetch(
      `*[_type == "project" && slug.current == $slug][0]._id`,
      { slug: p.slug }
    )
    if (existing) {
      console.log(`  ⚠ already exists — skipping`)
      continue
    }

    // Thumbnail
    let thumbnail = null
    if (p.thumbnail?.url) {
      const id = await uploadImage(p.thumbnail.url)
      if (id) thumbnail = imageRef(id, p.thumbnail.alt ?? '')
    }

    // Gallery — deduplicate by URL
    const seen = new Set<string>()
    const images = []
    for (const img of p.images ?? []) {
      if (!img.url || seen.has(img.url)) continue
      seen.add(img.url)
      const id = await uploadImage(img.url)
      if (id) images.push({ ...imageRef(id, img.alt ?? ''), _key: id.replace('image-', '').slice(0, 12) })
    }

    await client.createOrReplace({
      _type: 'project',
      _id: `project-${p.slug}`,
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      client: p.client,
      year: p.year,
      services: p.services?.trim() ?? '',
      tags: p.tags ?? [],
      description: p.description ?? '',
      thumbnail,
      images,
      texts: p.texts ?? [],
      quoteText: p.quote?.text ?? '',
      quoteAuthor: p.quote?.author ?? '',
      quoteRole: p.quote?.role ?? '',
      liveWebsite: p.liveWebsite ?? '',
      awards: p.awards ?? '',
      order: p.order ?? 99,
      isDraft: p.isDraft ?? false,
    })

    console.log(`  ✓ created`)
  }
}

// ─── Blog posts ───────────────────────────────────────────────────────────────

async function migratePosts() {
  const raw = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/blog.json'), 'utf8')
  )

  for (const p of raw) {
    console.log(`\n📝 ${p.title}`)

    const existing = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]._id`,
      { slug: p.slug }
    )
    if (existing) {
      console.log(`  ⚠ already exists — skipping`)
      continue
    }

    let mainImage = null
    if (p.coverImage?.url) {
      const id = await uploadImage(p.coverImage.url)
      if (id) mainImage = imageRef(id, p.coverImage.alt ?? '')
    }

    await client.createOrReplace({
      _type: 'post',
      _id: `post-${p.slug}`,
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      excerpt: p.excerpt ?? '',
      mainImage,
      category: CATEGORY_LABELS[p.category] ?? p.category ?? '',
      publishedAt: p.publishedAt,
      body: [],
      metaTitle: p.metaTitle ?? '',
      metaDescription: p.metaDescription ?? '',
    })

    console.log(`  ✓ created`)
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error(`
❌  SANITY_API_TOKEN is missing.

1. Go to https://sanity.io/manage
2. Select your project → API → Tokens → Add API Token
3. Role: Editor
4. Add to .env.local:
   SANITY_API_TOKEN=your_token_here

Then run: npx tsx scripts/migrate-to-sanity.ts
`)
    process.exit(1)
  }

  console.log('🚀 Migrating to Sanity...\n')
  await migrateProjects()
  await migratePosts()
  console.log('\n✅ Done! Open /studio to review.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
