'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project, ContentBlock } from '@/lib/data/types'
import s from './ProjectBody.module.css'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  project: Project
}

// ── Legacy hardcoded sections (used when project.content is empty) ──────────
const SECTIONS = [
  { key: 'brand',   label: 'Brand Systems',        textIndex: 0, imgStart: 0, imgEnd: 2, layout: 'twoUp' as const },
  { key: 'digital', label: 'Digital Experiences',  textIndex: 1, imgStart: 2, imgEnd: 3, layout: 'full'  as const },
  { key: 'motion',  label: 'Motion & AI Design',   textIndex: 2, imgStart: 3, imgEnd: 5, layout: 'multi' as const },
]

function ImageBlock({ block, name }: { block: Extract<ContentBlock, { _type: 'imageBlock' }>; name: string }) {
  if (!block.url) return null
  return (
    <div className={block.layout === 'half' ? s.imageWrapHalf : s.imageWrapFull}>
      <Image
        src={block.url}
        alt={block.alt ?? name}
        fill
        sizes={block.layout === 'half' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 90vw'}
        className={`${s.image} ${block.mobileUrl ? s.imageDesktop : ''}`}
        unoptimized={block.url.endsWith('.gif')}
      />
      {block.mobileUrl && (
        <Image
          src={block.mobileUrl}
          alt={block.mobileAlt ?? name}
          fill
          sizes="100vw"
          className={`${s.image} ${s.imageMobile}`}
          unoptimized={block.mobileUrl.endsWith('.gif')}
        />
      )}
    </div>
  )
}

export default function ProjectBody({ project }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    const triggers: ScrollTrigger[] = []
    const revealEls = Array.from(body.querySelectorAll<HTMLElement>('[data-reveal]'))
    gsap.set(revealEls, { opacity: 0, y: 52, willChange: 'transform, opacity' })
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      body.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 86%',
          toggleActions: 'play none none none',
          onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out', clearProps: 'willChange' }),
        })
        triggers.push(st)
      })
    })
    return () => { cancelAnimationFrame(raf); triggers.forEach((st) => st.kill()) }
  }, [])

  // ── Quote block (shared between both render paths) ──────────────────────
  const quoteEl = project.quote?.text ? (
    <section className={s.quoteSection}>
      <div className={s.quoteInner}>
        <blockquote className={s.quoteText} data-reveal>
          &ldquo;{project.quote.text}&rdquo;
        </blockquote>
        <footer className={s.quoteAttrib} data-reveal>
          <span className={s.quoteAuthor}>{project.quote.author}</span>
          {project.quote.role && <span className={s.quoteRole}>{project.quote.role}</span>}
        </footer>
      </div>
    </section>
  ) : null

  // ── New flexible content blocks ─────────────────────────────────────────
  if (project.content?.length > 0) {
    const blocks = project.content
    const rendered: React.ReactNode[] = []
    let i = 0

    while (i < blocks.length) {
      const block = blocks[i]

      if (block._type === 'textBlock') {
        rendered.push(
          <section key={i} className={s.section}>
            <div className={s.container}>
              <p className={s.bodyText} data-reveal>{block.text}</p>
            </div>
          </section>
        )
        i++
        continue
      }

      if (block._type === 'imageBlock') {
        if (block.layout === 'half') {
          // Collect consecutive half blocks into a row
          const group: typeof block[] = [block]
          while (i + group.length < blocks.length) {
            const next = blocks[i + group.length]
            if (next._type === 'imageBlock' && next.layout === 'half') group.push(next)
            else break
          }
          rendered.push(
            <section key={i} className={s.section}>
              <div className={s.container}>
                <div className={s.imagesTwoUp} data-reveal>
                  {group.map((b, gi) => (
                    <ImageBlock key={gi} block={b} name={project.name} />
                  ))}
                </div>
              </div>
            </section>
          )
          i += group.length
        } else {
          rendered.push(
            <section key={i} className={s.section}>
              <div className={s.container}>
                <div className={s.imagesFull} data-reveal>
                  <ImageBlock block={block} name={project.name} />
                </div>
              </div>
            </section>
          )
          i++
        }
        continue
      }

      i++
    }

    return (
      <div ref={bodyRef} className={s.body}>
        {rendered}
        {quoteEl}
      </div>
    )
  }

  // ── Legacy render (projects without content[]) ──────────────────────────
  return (
    <div ref={bodyRef} className={s.body}>
      {SECTIONS.map((sec, idx) => {
        const text   = project.texts?.[sec.textIndex]
        const images = project.images?.slice(sec.imgStart, sec.imgEnd) ?? []

        const quoteBlock = idx === 1 ? quoteEl : null

        const sectionBlock = (text || images.length > 0) ? (
          <section key={sec.key} className={s.section}>
            <div className={s.container}>
              {images.length > 0 && (
                <div
                  className={sec.layout === 'twoUp' ? s.imagesTwoUp : sec.layout === 'full' ? s.imagesFull : s.imagesMulti}
                  data-reveal
                >
                  {images.map((img, i) => (
                    <div key={i} className={s.imageWrap}>
                      <Image
                        src={img.url}
                        alt={img.alt ?? `${project.name} — ${sec.label}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 45vw"
                        className={`${s.image} ${img.mobileImage ? s.imageDesktop : ''}`}
                        unoptimized={img.url.endsWith('.gif')}
                      />
                      {img.mobileImage && (
                        <Image
                          src={img.mobileImage.url}
                          alt={img.mobileImage.alt ?? `${project.name} — ${sec.label}`}
                          fill
                          sizes="100vw"
                          className={`${s.image} ${s.imageMobile}`}
                          unoptimized={img.mobileImage.url.endsWith('.gif')}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
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
