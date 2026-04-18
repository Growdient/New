import type { Metadata } from 'next'
import { getPosts } from '@/lib/data/blog'
import BlogHero from '@/components/sections/BlogHero'
import BlogGrid from '@/components/sections/BlogGrid'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Branding, identity, web design — written by practitioners. Articles on brand strategy, visual identity, web development, and design process.',
  alternates: {
    canonical: 'https://growdient.com/blog',
  },
}

export default function BlogPage() {
  const posts = getPosts()

  return (
    <main className={s.main} data-theme="light">
      <BlogHero postCount={posts.length} />
      <BlogGrid posts={posts} />
    </main>
  )
}
