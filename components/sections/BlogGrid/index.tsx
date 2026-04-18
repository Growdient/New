'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlogCard from '@/components/sections/BlogCard'
import { getCategoryLabel } from '@/lib/data/blog'
import type { BlogPost } from '@/lib/data/types'
import s from './BlogGrid.module.css'

gsap.registerPlugin(ScrollTrigger)

interface BlogGridProps {
  posts: BlogPost[]
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const featured = posts[0]
  const rest = posts.slice(1)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (featuredRef.current) {
        gsap.from(featuredRef.current, {
          y: 60,
          opacity: 0,
          duration: 1.0,
          ease: 'quart.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('[data-card]')
        gsap.from(cards, {
          y: 70,
          opacity: 0,
          stagger: { amount: 0.7, from: 'start' },
          duration: 0.95,
          ease: 'quart.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.container}>

        {/* ── FEATURED FIRST POST ────────────────────────────────────────── */}
        {featured && (
          <div ref={featuredRef} className={s.featured}>
            <BlogCard
              post={featured}
              categoryLabel={getCategoryLabel(featured.category)}
              featured
            />
          </div>
        )}

        {/* ── GRID — remaining posts ────────────────────────────────────── */}
        {rest.length > 0 && (
          <div ref={gridRef} className={s.grid}>
            {rest.map((post) => (
              <div key={post.id} data-card className={s.cardWrap}>
                <BlogCard
                  post={post}
                  categoryLabel={getCategoryLabel(post.category)}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
