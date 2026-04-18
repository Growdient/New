'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/lib/data/types'
import s from './WorkProjectList.module.css'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  projects: Project[]
}

export default function WorkProjectList({ projects }: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const triggers: ScrollTrigger[] = []
    const hoverTimelines: gsap.core.Timeline[] = []
    let mobileBlurCleanup: (() => void) | null = null

    // Pre-hide all items immediately — eliminates the flash before rAF fires
    const allItems = Array.from(list.querySelectorAll<HTMLElement>(`.${s.item}`))
    gsap.set(allItems, { opacity: 0, y: 56, willChange: 'transform, opacity' })

    const raf = requestAnimationFrame(() => {
      const items = list.querySelectorAll(`.${s.item}`)
      if (!items.length) return

      ScrollTrigger.refresh()

      // ── Blur hero headline as project list scrolls over it ──────────────────
      const heroBlur = document.querySelector('[data-work-hero-blur]') as HTMLElement | null
      if (heroBlur) {
        if (window.innerWidth <= 767) {
          // Mobile: getBoundingClientRect every tick — bypasses Lenis/ScrollTrigger
          const tickerFn = () => {
            const listTop = list.getBoundingClientRect().top
            const vh = window.innerHeight
            const p = Math.max(0, Math.min(1, (vh * 0.9 - listTop) / (vh * 0.5)))
            heroBlur.style.filter    = `blur(${p * 20}px)`
            heroBlur.style.transform = `scale(${1 - p * 0.04})`
          }
          gsap.ticker.add(tickerFn)
          mobileBlurCleanup = () => gsap.ticker.remove(tickerFn)
        } else {
          // Desktop: ScrollTrigger scrub
          const st = ScrollTrigger.create({
            trigger: list,
            start: 'top 90%',
            end:   'top 45%',
            scrub: 0.8,
            onUpdate: (self) => {
              const p = self.progress
              gsap.set(heroBlur, {
                filter: `blur(${p * 20}px)`,
                scale:  1 - p * 0.04,
              })
            },
            onLeaveBack: () => {
              gsap.set(heroBlur, { filter: 'blur(0px)', scale: 1 })
            },
          })
          triggers.push(st)
        }
      }

      // ── Card entrance ────────────────────────────────────────────────────────
      items.forEach((item) => {
        const st = ScrollTrigger.create({
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none',
          onEnter: () => {
            gsap.to(item, {
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

      // ── Card hover ───────────────────────────────────────────────────────────
      list.querySelectorAll<HTMLElement>(`.${s.card}`).forEach((card) => {
        const image = card.querySelector(`.${s.image}`) as HTMLElement | null
        const overlay = card.querySelector(`.${s.overlay}`) as HTMLElement | null

        const tl = gsap.timeline({ paused: true })
        if (image)   tl.fromTo(image,   { scale: 1 }, { scale: 1.06, duration: 0.5, ease: 'sine.inOut' }, 0)
        if (overlay) tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'sine.inOut' }, 0)
        hoverTimelines.push(tl)

        const enter = () => tl.play()
        const leave = () => tl.reverse()
        card.addEventListener('mouseenter', enter)
        card.addEventListener('mouseleave', leave)
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      triggers.forEach((st) => st.kill())
      hoverTimelines.forEach((tl) => tl.kill())
      mobileBlurCleanup?.()
    }
  }, [])

  return (
    <div ref={listRef} className={s.list}>
      {projects.map((project) => {
        const thumbnail = project.thumbnail?.url
        const primaryService = project.services || project.tags?.[0]

        return (
          <div key={project.id} className={s.item}>
            <Link
              href={`/projects/${project.slug}`}
              className={s.card}
              aria-label={`View ${project.name}`}
            >
              <div className={s.imageWrap}>
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={project.thumbnail?.alt ?? project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                    className={s.image}
                  />
                ) : (
                  <div className={s.placeholder} />
                )}
                <div className={s.overlay} aria-hidden="true" />
              </div>

              <div className={s.content}>
                <p className={s.title}>{project.name}</p>
                {primaryService && (
                  <span className={s.service}>{primaryService}</span>
                )}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
