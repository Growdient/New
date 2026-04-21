import { portableTextToHtml } from './ptToHtml'
import { sanityClient } from './client'
import type { Project, BlogPost, ImageAsset } from '@/lib/data/types'

// ─── Projects ────────────────────────────────────────────────────────────────

const PROJECT_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  client,
  year,
  services,
  tags,
  description,
  "thumbnail": thumbnail {
    "url": asset->url,
    alt
  },
  "images": images[] {
    "url": asset->url,
    alt,
    "mobileImage": mobileImage {
      "url": asset->url,
      alt
    }
  },
  texts,
  "quote": {
    "text": quoteText,
    "author": quoteAuthor,
    "role": quoteRole
  },
  liveWebsite,
  awards,
  order,
  isDraft,
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  "ogImage": ogImage {
    "url": asset->url,
    alt
  }
`

function mapProject(raw: Record<string, unknown>): Project {
  return {
    id: raw._id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    client: raw.client as string,
    year: raw.year as string,
    services: (raw.services as string) ?? '',
    tags: (raw.tags as string[]) ?? [],
    description: (raw.description as string) ?? '',
    thumbnail: (raw.thumbnail as ImageAsset) ?? null,
    images: (raw.images as ImageAsset[]) ?? [],
    texts: (raw.texts as string[]) ?? [],
    quote: (raw.quote as Project['quote']) ?? { text: '', author: '', role: '' },
    liveWebsite: raw.liveWebsite as string | undefined,
    awards: raw.awards as string | undefined,
    order: (raw.order as number) ?? 99,
    isDraft: (raw.isDraft as boolean) ?? false,
    metaTitle: raw.metaTitle as string | undefined,
    metaDescription: raw.metaDescription as string | undefined,
    ogTitle: raw.ogTitle as string | undefined,
    ogDescription: raw.ogDescription as string | undefined,
    ogImage: (raw.ogImage as ImageAsset) ?? undefined,
  }
}

export async function sanityGetProjects(): Promise<Project[]> {
  const raw = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`,
    {},
    { next: { revalidate: 60 } }
  )
  return raw.map(mapProject)
}

export async function sanityGetPublishedProjects(): Promise<Project[]> {
  const raw = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "project" && isDraft != true] | order(order asc) { ${PROJECT_FIELDS} }`,
    {},
    { next: { revalidate: 60 } }
  )
  return raw.map(mapProject)
}

export async function sanityGetProject(slug: string): Promise<Project | null> {
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_type == "project" && slug.current == $slug][0] { ${PROJECT_FIELDS} }`,
    { slug },
    { next: { revalidate: 60 } }
  )
  return raw ? mapProject(raw) : null
}

export async function sanityGetMoreWorkProjects(slug: string): Promise<[Project, Project] | [Project] | []> {
  const published = await sanityGetPublishedProjects()
  const idx = published.findIndex((p) => p.slug === slug)
  if (published.length < 2) return []
  const others = published.filter((_, i) => i !== idx)
  const a = others[idx % others.length]
  const b = others[(idx + 1) % others.length]
  if (a === b) return [a]
  return [a, b]
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

const POST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "coverImage": mainImage {
    "url": asset->url,
    alt
  },
  category,
  publishedAt,
  body,
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  "ogImage": ogImage {
    "url": asset->url,
    alt
  }
`

function mapPost(raw: Record<string, unknown>): BlogPost {
  // Serialize Portable Text blocks to HTML string
  const bodyHtml = raw.body ? portableTextToHtml(raw.body as unknown[]) : ''

  return {
    id: raw._id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    publishedAt: (raw.publishedAt as string) ?? '',
    excerpt: raw.excerpt as string | undefined,
    coverImage: (raw.coverImage as ImageAsset) ?? undefined,
    body: bodyHtml,
    category: raw.category as string | undefined,
    metaTitle: raw.metaTitle as string | undefined,
    metaDescription: raw.metaDescription as string | undefined,
    ogTitle: raw.ogTitle as string | undefined,
    ogDescription: raw.ogDescription as string | undefined,
    ogImage: (raw.ogImage as ImageAsset) ?? undefined,
  }
}

export async function sanityGetPosts(): Promise<BlogPost[]> {
  const raw = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "post"] | order(publishedAt desc) { ${POST_FIELDS} }`,
    {},
    { next: { revalidate: 60 } }
  )
  return raw.map(mapPost)
}

export async function sanityGetPost(slug: string): Promise<BlogPost | null> {
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_type == "post" && slug.current == $slug][0] { ${POST_FIELDS} }`,
    { slug },
    { next: { revalidate: 60 } }
  )
  return raw ? mapPost(raw) : null
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteTitle?: string
  siteDescription?: string
  ogImageUrl?: string
  twitterHandle?: string
  email?: string
  phone?: string
}

export async function sanityGetSiteSettings(): Promise<SiteSettings> {
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_type == "siteSettings"][0] {
      siteTitle,
      siteDescription,
      "ogImageUrl": ogImage.asset->url,
      twitterHandle,
      email,
      phone
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
  return raw ?? {}
}
