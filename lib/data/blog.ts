import blogData from '@/data/blog.json'
import type { BlogPost } from './types'

export const CATEGORY_LABELS: Record<string, string> = {
  '045272695e1850b182d0a873052a3ff6': 'Branding Strategy',
  'f48b61242d6508f83d6ab58bf883e0f6': 'AI in Design',
  'cc3d76279f339d2a6c049c566bc5c5a5': 'Design Services',
  '742389aea11fb32c9dbd0a935ce9c030': 'Web Development',
  '53b9e8a15cc901afcae7ac48f9a93ff4': 'Web & UI/UX',
  'ae9365d9fe8e15c5739db075915e88fd': 'Naming & Positioning',
  '0652cf3d5caa55e51c9ec589581e5785': 'Logo Design',
  'd06d2a7baeb96150ab93cf8cac25c184': 'Brand Identity',
}

export function getCategoryLabel(id: string | undefined): string {
  if (!id) return ''
  return CATEGORY_LABELS[id] ?? ''
}

export function getPosts(): BlogPost[] {
  return (blogData as BlogPost[]).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getLatestPosts(count: number = 3): BlogPost[] {
  return getPosts().slice(0, count)
}

export function getPost(slug: string): BlogPost | undefined {
  return getPosts().find((p) => p.slug === slug)
}

export function getEstimatedReadTime(body: string): number {
  const words = body.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export interface TocItem {
  id: string
  text: string
}

export function extractHeadings(html: string): TocItem[] {
  const matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
  return matches.map((match) => {
    const text = match[1].replace(/<[^>]+>/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    return { id, text }
  })
}
