import { sanityClient, urlFor } from './client'
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
    alt
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
  isDraft
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
  }
}

export async function sanityGetProjects(): Promise<Project[]> {
  const raw = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`
  )
  return raw.map(mapProject)
}

export async function sanityGetPublishedProjects(): Promise<Project[]> {
  const raw = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "project" && isDraft != true] | order(order asc) { ${PROJECT_FIELDS} }`
  )
  return raw.map(mapProject)
}

export async function sanityGetProject(slug: string): Promise<Project | null> {
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_type == "project" && slug.current == $slug][0] { ${PROJECT_FIELDS} }`,
    { slug }
  )
  return raw ? mapProject(raw) : null
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
  metaDescription
`

function mapPost(raw: Record<string, unknown>): BlogPost {
  return {
    id: raw._id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    publishedAt: (raw.publishedAt as string) ?? '',
    excerpt: raw.excerpt as string | undefined,
    coverImage: (raw.coverImage as ImageAsset) ?? undefined,
    body: raw.body as string,
    category: raw.category as string | undefined,
    metaTitle: raw.metaTitle as string | undefined,
    metaDescription: raw.metaDescription as string | undefined,
  }
}

export async function sanityGetPosts(): Promise<BlogPost[]> {
  const raw = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "post"] | order(publishedAt desc) { ${POST_FIELDS} }`
  )
  return raw.map(mapPost)
}

export async function sanityGetPost(slug: string): Promise<BlogPost | null> {
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_type == "post" && slug.current == $slug][0] { ${POST_FIELDS} }`,
    { slug }
  )
  return raw ? mapPost(raw) : null
}
