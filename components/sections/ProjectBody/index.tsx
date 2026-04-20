'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/lib/data/types'
import s from './ProjectBody.module.css'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  project: Project
}

// ── Content section definitions (match Webflow template order) ─────────────
const SECTIONS = [
  {
    key: 'brand',
    label: 'Brand Systems',
    teaser: 'adaptable brand frameworks',
    textIndex: 0,
    imgStart: 0,
    imgEnd: 2,
    layout: 'twoUp' as const,
  },
  {
    key: 'digital',
    label: 'Digital Experiences',
    teaser: null,
    textIndex: 1,
    imgStart: 2,
    imgEnd: 3,
    layout: 'full' as const,
  },
  // Quote renders between digital and motion (see below)
  {
    key: 'motion',
    label: 'Motion & AI Design',
    teaser: 'subtle micro-interactions',
    textIndex: 2,
    imgStart: 3,
    imgEnd: 5,
    layout: 'multi' as const,
  },
]

export default function ProjectBody({ project }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return

    const triggers: ScrollTrigger[] = []

    // Pre-hide all reveal elements immediately — no flash before rAF fires
    const revealEls = Array.from(body.querySelectorAll<HTMLElement>('[data-reveal]'))
    gsap.set(revealEls, { opacity: 0, y: 52, willChange: 'transform, opacity' })

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()

      body.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 86%',
          toggleActions: 'play none none none',
          onEnter: () => {
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 1.0,
              ease: 'expo.out',
              clearProps: 'willChange',
            })
          },
        })
        triggers.push(st)
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      triggers.forEach((st) => st.kill())
    }
  }, [])

  return (
    <div ref={bodyRef} className={s.body}>
      {SECTIONS.map((sec, idx) => {
        const text   = project.texts?.[sec.textIndex]
        const images = project.images?.slice(sec.imgStart, sec.imgEnd) ?? []

        // Quote renders after "Digital Experiences" (idx === 1)
        const quoteBlock = idx === 1 && project.quote?.text ? (
          <section key="quote" className={s.quoteSection}>
            <div className={s.quoteInner}>
              <blockquote className={s.quoteText} data-reveal>
                &ldquo;{project.quote.text}&rdquo;
              </blockquote>
              <footer className={s.quoteAttrib} data-reveal>
                <span className={s.quoteAuthor}>{project.quote.author}</span>
                {project.quote.role && (
                  <span className={s.quoteRole}>{project.quote.role}</span>
                )}
              </footer>
            </div>
          </section>
        ) : null

        const sectionBlock = (text || images.length > 0) ? (
          <section key={sec.key} className={s.section}>
            <div className={s.container}>

              {/* Images first */}
              {images.length > 0 && (
                <div
                  className={
                    sec.layout === 'twoUp' ? s.imagesTwoUp :
                    sec.layout === 'full'  ? s.imagesFull  :
                    s.imagesMulti
                  }
                  data-reveal
                >
                  {images.map((img, i) => {
                    const desktop = img.desktop
                    const mobile = img.mobile ?? img.desktop
                    if (!desktop) return null
                    return (
                      <div key={i} className={s.imageWrap}>
                        <Image
                          src={desktop.url}
                          alt={desktop.alt ?? `${project.name} — ${sec.label}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 45vw"
                          className={`${s.image} ${s.imageDesktop}`}
                          unoptimized={desktop.url.endsWith('.gif')}
                        />
                        {mobile && mobile.url !== desktop.url && (
                          <Image
                            src={mobile.url}
                            alt={mobile.alt ?? `${project.name} — ${sec.label}`}
                            fill
                            sizes="100vw"
                            className={`${s.image} ${s.imageMobile}`}
                            unoptimized={mobile.url.endsWith('.gif')}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* textBlock скрыт для всех секций */}

            </div>
          </section>
        ) : null

        return (
          <React.Fragment key={sec.key}>
            {sectionBlock}
            {quoteBlock}
          </React.Fragment>
        )
      })}
    </div>
  )
}
