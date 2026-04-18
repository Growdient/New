import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityGetPost, sanityGetPosts } from '@/lib/sanity/queries'
import { getEstimatedReadTime, extractHeadings } from '@/lib/data/blog'
import BlogArticleHero from '@/components/sections/BlogArticleHero'
import BlogArticleBody from '@/components/sections/BlogArticleBody'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await sanityGetPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await sanityGetPost(slug)
  if (!post) return {}
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    alternates: { canonical: `https://growdient.com/blog/${post.slug}` },
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([
    sanityGetPost(slug),
    sanityGetPosts(),
  ])
  if (!post) notFound()

  const readTime = getEstimatedReadTime(post.body)
  const tocItems = extractHeadings(post.body)
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <main>
      <BlogArticleHero
        title={post.title}
        coverImage={post.coverImage}
      />
      <BlogArticleBody
        title={post.title}
        excerpt={post.excerpt}
        body={post.body}
        relatedPosts={relatedPosts}
        tocItems={tocItems}
      />
    </main>
  )
}
