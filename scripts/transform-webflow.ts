/**
 * Transforms raw Webflow CMS export JSON into clean TypeScript-typed data files.
 * Run: npx tsx scripts/transform-webflow.ts
 */

import fs from 'fs'
import path from 'path'
import type { Project, BlogPost, ImageAsset } from '../lib/data/types'

const ROOT = path.join(__dirname, '..')
const WEBFLOW_PATH = path.join(ROOT, '..', 'webflow-export', 'full', 'growdient-ebea65')
const DATA_PATH = path.join(ROOT, 'data')

fs.mkdirSync(DATA_PATH, { recursive: true })

// ─── HELPERS ────────────────────────────────────────────────────────────────

function normalizeImage(raw: unknown): ImageAsset | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const url = (obj.url as string) || ''
  if (!url) return null
  return {
    url,
    alt: (obj.alt as string | null) ?? null,
  }
}

// ─── PROJECTS ───────────────────────────────────────────────────────────────

const rawProjects = JSON.parse(
  fs.readFileSync(path.join(WEBFLOW_PATH, 'cms', 'projects', 'items.json'), 'utf-8')
) as Array<{
  id: string
  isDraft: boolean
  fieldData: Record<string, unknown>
}>

const imageKeys = ['image-1', 'image-2', 'image-3', 'image-4', 'imag-5', 'imag-6',
  'image-large', 'image-large-2', 'image-large-3', 'image-iarge-4', 'image-large-5',
  'horizontal-4', 'horizontal-5', 'horizontal-6', 'horizonta-3',
  'vertical-5', 'vertical-6', 'mobail']

const textKeys = ['text-1', 'text-2', 'text-3', 'text-4', 'text-5',
  'text-6', 'text-7', 'text-8', 'text-9']

const projects: Project[] = rawProjects
  .map((item) => {
    const d = item.fieldData

    const images: ImageAsset[] = imageKeys
      .map((k) => normalizeImage(d[k]))
      .filter((img): img is ImageAsset => img !== null)

    const texts: string[] = textKeys
      .map((k) => d[k] as string | undefined)
      .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)

    const tags: string[] = [d['tag-2'], d['tag-3']]
      .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)

    return {
      id: item.id,
      name: (d['name'] as string) || '',
      slug: (d['slug'] as string) || '',
      client: (d['client'] as string) || '',
      year: (d['year'] as string) || '',
      services: (d['services'] as string) || '',
      tags,
      description: (d['description'] as string) || '',
      thumbnail: normalizeImage(d['thumbnail']),
      images,
      texts,
      quote: {
        text: (d['quote-text'] as string) || '',
        author: (d['quote-author'] as string) || '',
        role: (d['quote-role'] as string) || '',
      },
      liveWebsite: (d['live-website'] as string | undefined) || undefined,
      awards: (d['awards'] as string | undefined) || (d['awards-2'] as string | undefined) || undefined,
      order: typeof d['poryadok'] === 'number' ? (d['poryadok'] as number) : 99,
      isDraft: item.isDraft,
    } satisfies Project
  })
  .filter((p) => !p.isDraft)
  .sort((a, b) => a.order - b.order)

fs.writeFileSync(path.join(DATA_PATH, 'projects.json'), JSON.stringify(projects, null, 2))
console.log(`✓ projects.json — ${projects.length} records`)

// ─── BLOG ────────────────────────────────────────────────────────────────────

const rawBlog = JSON.parse(
  fs.readFileSync(path.join(WEBFLOW_PATH, 'cms', 'blog', 'items.json'), 'utf-8')
) as Array<{
  id: string
  isDraft: boolean
  fieldData: Record<string, unknown>
}>

const blogPosts: BlogPost[] = rawBlog
  .filter((item) => !item.isDraft)
  .map((item) => {
    const d = item.fieldData

    const bodyParts = ['body-1', 'body-2']
      .map((k) => d[k] as string | undefined)
      .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)

    return {
      id: item.id,
      title: (d['name'] as string) || '',
      slug: (d['slug'] as string) || '',
      publishedAt: (d['published-on-2'] as string) || new Date().toISOString(),
      excerpt: (d['short-description'] as string | undefined) || undefined,
      coverImage: normalizeImage(d['thumbnail']) ?? undefined,
      body: bodyParts.join('\n\n'),
      category: (d['category'] as string | undefined) || undefined,
      metaTitle: (d['meta-title'] as string | undefined) || undefined,
      metaDescription: (d['meta-description'] as string | undefined) || undefined,
    } satisfies BlogPost
  })
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

fs.writeFileSync(path.join(DATA_PATH, 'blog.json'), JSON.stringify(blogPosts, null, 2))
console.log(`✓ blog.json — ${blogPosts.length} records`)

console.log('\n✅ Transformation complete')
