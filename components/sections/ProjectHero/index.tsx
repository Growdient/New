'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import type { Project } from '@/lib/data/types'
import s from './ProjectHero.module.css'

interface Props {
  project: Project
}

export default function ProjectHero({ project }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const metaRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return

    // Word-mask entrance
    const words = project.name.split(' ')
    el.innerHTML = words
      .map((w) => `<span class="${s.wordWrap}"><span class="${s.word}">${w}</span></span>`)
      .join(' ')

    const wordEls = el.querySelectorAll<HTMLElement>(`.${s.word}`)
    gsap.set(wordEls, { y: '110%' })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(wordEls, { y: '0%', stagger: 0.06, duration: 1.0, delay: 0.3 })

    if (metaRef.current) {
      const metaChildren = Array.from(metaRef.current.children) as HTMLElement[]
      gsap.set(metaChildren, { opacity: 0, y: 16 })
      gsap.to(metaChildren, {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.8,
        ease: 'expo.out',
        delay: 0.5,
      })
    }

    return () => { tl.kill() }
  }, [project.name])

  return (
    <>
      {/* ── HERO: full-screen image + title bottom-left ─────────────────────── */}
      <section className={s.hero}>
        {project.thumbnail && (
          <Image
            src={project.thumbnail.url}
            alt={project.thumbnail.alt ?? project.name}
            fill
            sizes="100vw"
            className={s.heroImage}
            priority
          />
        )}
        <div className={s.heroGradient} />
        <h1
          ref={titleRef}
          className={s.title}
          aria-label={project.name}
        />
      </section>

      {/* ── META + DESCRIPTION: cream section ──────────────────────────────── */}
      <section className={s.about}>
        <div ref={metaRef} className={s.aboutInner}>

          <div className={s.metaGrid}>
            <div className={s.metaGroup}>
              <span className={s.metaLabel}>Services</span>
              <div className={s.metaValues}>
                <span className={s.metaText}>{project.services}</span>
                {project.tags.map((tag) => (
                  <span key={tag} className={s.metaText}>{tag}</span>
                ))}
              </div>
            </div>
            <div className={s.metaGroup}>
              <span className={s.metaLabel}>Client</span>
              <span className={s.metaText}>{project.client}</span>
            </div>
            <div className={s.metaGroup}>
              <span className={s.metaLabel}>Year</span>
              <span className={s.metaText}>{project.year}</span>
            </div>
            {project.liveWebsite && (
              <div className={s.metaGroup}>
                <span className={s.metaLabel}>Live website</span>
                <a
                  href={project.liveWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.metaLink}
                >
                  {project.liveWebsite.replace(/^https?:\/\//, '')} ↗
                </a>
              </div>
            )}
          </div>

          <h2 className={s.description}>{project.description}</h2>

        </div>
      </section>
    </>
  )
}
