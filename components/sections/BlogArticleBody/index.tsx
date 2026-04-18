'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { getCategoryLabel } from '@/lib/data/blog'
import type { TocItem } from '@/lib/data/blog'
import type { BlogPost } from '@/lib/data/types'
import s from './BlogArticleBody.module.css'

interface Props {
  title: string
  excerpt?: string
  body: string
  relatedPosts: BlogPost[]
  tocItems: TocItem[]
}

/** Get element's top offset relative to the document (not viewport). */
function getDocumentTop(el: HTMLElement): number {
  let top = 0
  let cur: HTMLElement | null = el
  while (cur) {
    top += cur.offsetTop
    cur = cur.offsetParent as HTMLElement | null
  }
  return top
}

export default function BlogArticleBody({ title, excerpt, body, relatedPosts, tocItems }: Props) {
  const progressRef = useRef<HTMLDivElement>(null)
  const articleRef  = useRef<HTMLElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const tocRef      = useRef<HTMLDivElement>(null)
  // Pre-calculated document-relative offsets — stable, not viewport-relative
  const offsetsRef  = useRef<{ id: string; top: number }[]>([])
  const lockedRef   = useRef(false)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [activeId, setActiveId] = useState<string>(tocItems[0]?.id ?? '')

  /* ── Reading progress bar ──────────────────────────────────────────────── */
  useEffect(() => {
    const bar = progressRef.current
    if (!bar) return
    const onScroll = () => {
      const pct = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      bar.style.transform = `scaleX(${Math.min(pct, 1)})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Title word-mask entrance ─────────────────────────────────────────── */
  useEffect(() => {
    const el = titleRef.current
    if (!el || !title) return
    const words = title.split(' ')
    el.innerHTML = words
      .map((w) => `<span class="${s.wordWrap}"><span class="${s.word}">${w}</span></span>`)
      .join(' ')
    const wordEls = el.querySelectorAll<HTMLSpanElement>(`.${s.word}`)
    gsap.set(wordEls, { y: '110%' })
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(wordEls, { y: '0%', stagger: 0.025, duration: 1.1, delay: 0.15 })
    return () => { tl.kill() }
  }, [title])

  /* ── ToC entrance stagger ─────────────────────────────────────────────── */
  useEffect(() => {
    const toc = tocRef.current
    if (!toc || tocItems.length === 0) return
    const links = toc.querySelectorAll<HTMLAnchorElement>('a')
    gsap.set(links, { opacity: 0, y: 7 })
    gsap.to(links, {
      opacity: 1,
      y: 0,
      stagger: 0.055,
      duration: 0.9,
      ease: 'expo.out',
      delay: 0.5,
    })
  }, [tocItems])

  /* ── Details accordion — GSAP height animation ─────────────────────────── */
  useEffect(() => {
    const article = articleRef.current
    if (!article || !body) return

    const detailsEls = Array.from(article.querySelectorAll<HTMLDetailsElement>('details'))
    const cleanups: Array<() => void> = []

    detailsEls.forEach((det) => {
      const summary = det.querySelector('summary')
      if (!summary) return

      // Wrap non-summary children in an animated container
      const content = document.createElement('div')
      content.className = s.detailsContent
      Array.from(det.children).forEach((child) => {
        if (child !== summary) content.appendChild(child)
      })
      det.appendChild(content)

      // Start fully collapsed
      gsap.set(content, { height: 0 })

      const handleClick = (e: Event) => {
        e.preventDefault()
        const isOpen = det.hasAttribute('open')

        if (isOpen) {
          // Close: animate to 0, then remove [open] so the icon rotates back
          gsap.to(content, {
            height: 0,
            duration: 0.55,
            ease: 'quart.inOut',
            onComplete: () => det.removeAttribute('open'),
          })
        } else {
          // Open: set [open] first so [data-theme] and CSS ::after rotate triggers
          det.setAttribute('open', '')
          gsap.fromTo(content,
            { height: 0 },
            { height: 'auto', duration: 0.72, ease: 'expo.out' }
          )
        }
      }

      summary.addEventListener('click', handleClick)
      cleanups.push(() => summary.removeEventListener('click', handleClick))
    })

    return () => cleanups.forEach((fn) => fn())
  }, [body])

  /* ── Main effect: inject IDs, pre-calculate offsets, scroll listener, GSAP */
  useEffect(() => {
    if (!body) return
    gsap.registerPlugin(ScrollTrigger)

    const article = articleRef.current
    if (!article) return

    // 1. Inject IDs into H2 elements
    const h2Els = Array.from(article.querySelectorAll<HTMLElement>('h2'))
    h2Els.forEach((el, i) => { if (tocItems[i]) el.id = tocItems[i].id })

    // 2. Pre-calculate document-relative offsets ONCE (stable during scroll)
    offsetsRef.current = h2Els.map((el) => ({
      id:  el.id,
      top: getDocumentTop(el),
    }))

    // 3. Scroll-based active tracking using document offsets
    const syncActive = () => {
      if (lockedRef.current) return
      const threshold = Math.round(window.innerHeight * 0.35)
      const scrollY = window.scrollY + threshold
      let found = offsetsRef.current[0]?.id ?? ''
      for (const { id, top } of offsetsRef.current) {
        if (top <= scrollY) found = id
      }
      setActiveId(found)
    }

    window.addEventListener('scroll', syncActive, { passive: true })
    syncActive() // initial sync

    // 4. GSAP reveals on H2 + blockquotes
    const triggers: ScrollTrigger[] = []

    h2Els.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 20 })
      triggers.push(ScrollTrigger.create({
        trigger: el,
        start: 'top 87%',
        once: true,
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'quart.out' }),
      }))
    })

    article.querySelectorAll<HTMLElement>('blockquote').forEach((el) => {
      gsap.set(el, { opacity: 0, x: -12 })
      triggers.push(ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.8, ease: 'quart.out' }),
      }))
    })

    return () => {
      window.removeEventListener('scroll', syncActive)
      triggers.forEach((t) => t.kill())
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [body, tocItems])

  /* ── ToC click handler ─────────────────────────────────────────────────── */
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()

    // 1. Lock scroll tracking FIRST — before any scroll fires
    lockedRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)

    // 2. Snap indicator to correct item immediately
    setActiveId(id)

    // 3. Scroll to section using pre-calculated document offset
    const offset = offsetsRef.current.find((o) => o.id === id)?.top ?? 0
    const targetScrollY = Math.max(0, offset - 96)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis__
    if (lenis) {
      lenis.scrollTo(targetScrollY)
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
    }

    // 4. Unlock after Lenis animation (duration 1.2s) + buffer
    timerRef.current = setTimeout(() => {
      lockedRef.current = false
    }, 1600)
  }

  return (
    <>
      {/* ── Reading progress ─────────────────────────────────────────────── */}
      <div className={s.progressTrack} aria-hidden="true">
        <div ref={progressRef} className={s.progressBar} />
      </div>

      {/* ── Article + Sidebar ─────────────────────────────────────────────── */}
      <section className={s.article} data-theme="light">
        <div className={s.articleInner}>

          <div className={s.proseColumn}>
            {/* ── Article header: title + excerpt ──────────────────────────── */}
            <div className={s.articleHeader}>
              <h1
                ref={titleRef}
                className={s.articleTitle}
                aria-label={title}
              >{title}</h1>
              {excerpt && <p className={s.articleExcerpt}>{excerpt}</p>}
            </div>

            {/* ── Prose body ───────────────────────────────────────────────── */}
            {body ? (
              <article
                ref={articleRef}
                className={s.prose}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <p className={s.emptyNote}>Article coming soon.</p>
            )}
          </div>

          {tocItems.length > 0 && (
            <aside className={s.sidebar} aria-label="Table of contents">
              <div ref={tocRef} className={s.toc}>
                <span className={s.tocLabel}>In this article</span>
                <nav>
                  <ul className={s.tocList}>
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`${s.tocLink} ${activeId === item.id ? s.tocLinkActive : ''}`}
                          onClick={(e) => handleTocClick(e, item.id)}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}

        </div>
      </section>

      {/* ── Related posts ─────────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className={s.related}>
          <div className={s.relatedInner}>
            <div className={s.relatedHeader}>
              <span className={s.relatedLabel}>Continue Reading</span>
            </div>
            <div className={s.relatedGrid}>
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={s.relatedCard}
                  aria-label={`Read: ${post.title}`}
                >
                  {post.coverImage?.url && (
                    <div className={s.relatedImageWrap}>
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt ?? post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={s.relatedImage}
                      />
                    </div>
                  )}
                  <div className={s.relatedContent}>
                    {post.category && (
                      <span className={s.relatedCategory}>
                        {getCategoryLabel(post.category)}
                      </span>
                    )}
                    <p className={s.relatedTitle}>{post.title}</p>
                    {post.excerpt && (
                      <p className={s.relatedExcerpt}>{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
