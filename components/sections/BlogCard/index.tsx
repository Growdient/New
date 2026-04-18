import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/data/types'
import s from './BlogCard.module.css'

interface BlogCardProps {
  post: BlogPost
  categoryLabel: string
  featured?: boolean
}

export default function BlogCard({ post, categoryLabel, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${s.card} ${featured ? s.cardFeatured : ''}`}
      aria-label={`Read: ${post.title}`}
    >
      {/* Cover image — no category badge, no overlay text */}
      {post.coverImage?.url && (
        <div className={s.imageWrap}>
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt ?? post.title}
            fill
            sizes={
              featured
                ? '(max-width: 768px) 100vw, 66vw'
                : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            }
            className={s.image}
          />
          <div className={s.overlay} aria-hidden="true" />
        </div>
      )}

      {/* Card content: category → title → excerpt only */}
      <div className={s.content}>
        <h3 className={s.title}>
          <span className={s.titleText}>{post.title}</span>
        </h3>
        {post.excerpt && (
          <p className={s.excerpt}>{post.excerpt}</p>
        )}
        {categoryLabel && (
          <span className={s.category}>{categoryLabel}</span>
        )}
      </div>
    </Link>
  )
}
