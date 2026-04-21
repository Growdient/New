export interface ImageAsset {
  url: string
  alt: string | null
  width?: number
  height?: number
  mobileImage?: ImageAsset
}

export type ContentBlock =
  | { _type: 'textBlock'; text: string }
  | { _type: 'imageBlock'; url: string; alt: string | null; mobileUrl?: string; mobileAlt?: string | null; layout: 'full' | 'half' }

export interface Project {
  id: string
  name: string
  slug: string
  client: string
  year: string
  services: string
  tags: string[]
  description: string
  thumbnail: ImageAsset | null
  images: ImageAsset[]
  texts: string[]
  content: ContentBlock[]
  quote: {
    text: string
    author: string
    role: string
  }
  liveWebsite?: string
  awards?: string
  order: number
  isDraft: boolean
  metaTitle?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: ImageAsset
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  publishedAt: string
  excerpt?: string
  coverImage?: ImageAsset
  body: string
  category?: string
  metaTitle?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: ImageAsset
}
