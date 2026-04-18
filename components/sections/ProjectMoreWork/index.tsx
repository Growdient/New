'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/lib/data/types'
import s from './ProjectMoreWork.module.css'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  projects: Project[]
}

export default function ProjectMoreWork({ projects }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const cards   = cardsRef.current
    if (!section || !cards || !projects.length) return

    const triggers: ScrollTrigger[] = []
    const hoverTls: gsap.core.Timeline[] = []

    // Pre-hide cards immediately to prevent flash before rAF fires
    const allCards = Array.from(cards.querySelectorAll<HTMLElement>(`.${s.card}`))
    gsap.set(allCards, { opacity: 0, y: 56, willChange: 'transform, opacity' })

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()

      // Card entrance
      cards.querySelectorAll<HTMLElement>(`.${s.card}`).forEach((card, i) => {
        const st = ScrollTrigger.create({
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
          onEnter: () => {
            gsap.to(card, {
              y: 0,
              opacity: 1,
              duration: 1.0,
              ease: 'expo.out',
              delay: i * 0.08,
              clearProps: 'willChange',
            })
          },
        })
        triggers.push(st)

        // Hover animation
        const img     = card.querySelector(`.${s.image}`)     as HTMLElement | null
        const overlay = card.querySelector(`.${s.overlay}`)   as HTMLElement | null

        const tl = gsap.timeline({ paused: true })
        if (img)     tl.fromTo(img,     { scale: 1 }, { scale: 1.06, duration: 0.5, ease: 'sine.inOut' }, 0)
        if (overlay) tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'sine.inOut' }, 0)
        hoverTls.push(tl)

        card.addEventListener('mouseenter', () => tl.play())
        card.addEventListener('mouseleave', () => tl.reverse())
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      triggers.forEach((st) => st.kill())
      hoverTls.forEach((tl) => tl.kill())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!projects.length) return null

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.container}>

        {/* ── "More work" headline ─────────────────────────────────────── */}
        <h2 className={s.heading}>More work</h2>

        {/* ── Project cards ────────────────────────────────────────────── */}
        <div ref={cardsRef} className={s.cards}>
          {projects.map((project) => {
            const thumb = project.thumbnail?.url
            const service = project.services || project.tags?.[0]

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className={s.card}
                aria-label={`View ${project.name}`}
              >
                {/* Image */}
                <div className={s.imageWrap}>
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={project.thumbnail?.alt ?? project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={s.image}
                    />
                  ) : (
                    <div className={s.placeholder} />
                  )}
                  <div className={s.overlay} aria-hidden="true" />
                </div>

                {/* Text */}
                <div className={s.cardText}>
                  <p className={s.cardTitle}>{project.name}</p>
                  {service && (
                    <span className={s.cardService}>{service.toUpperCase()}</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
