export interface ImageAsset {
  url: string
  alt: string | null
  width?: number
  height?: number
}

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
  quote: {
    text: string
    author: string
    role: string
  }
  liveWebsite?: string
  awards?: string
  order: number
  isDraft: boolean
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
}
