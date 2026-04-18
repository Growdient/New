'use client'

import { useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './ContactCTA.module.css'

gsap.registerPlugin(ScrollTrigger)

// Pexels 11322997 — Train/metro footage (из Webflow assets)
const TRAIN_VIDEO_URL =
  'https://s3.amazonaws.com/webflow-prod-assets/69273d885ceeda5caa00a47e/69273d8a5ceeda5caa00a6f4_11322997-hd_1920_1080_60fps.mp4'

export default function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLImageElement>(null)
  const rightHeadingRef = useRef<HTMLAnchorElement>(null)
  const leftLabelRef = useRef<HTMLSpanElement>(null)
  // ContactCTA lives in root layout and is never unmounted.
  // Re-initialize on each pathname change so destroyIX3Animations() (which
  // kills all ScrollTriggers globally) doesn't leave the section invisible.
  const pathname = usePathname()

  useEffect(() => {
    const section = sectionRef.current
    const wordmark = wordmarkRef.current
    const rightHeading = rightHeadingRef.current
    const leftLabel = leftLabelRef.current
    if (!section) return

    // Clear stale inline styles before re-creating the animation
    gsap.killTweensOf([leftLabel, rightHeading, wordmark].filter(Boolean))
    if (leftLabel)    gsap.set(leftLabel,    { clearProps: 'opacity,y' })
    if (rightHeading) gsap.set(rightHeading, { clearProps: 'opacity,y' })
    if (wordmark)     gsap.set(wordmark,     { clearProps: 'opacity,y' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 65%',
        once: true,
      },
    })

    if (leftLabel) {
      gsap.set(leftLabel, { opacity: 0, y: 10 })
      tl.to(leftLabel, { opacity: 1, y: 0, duration: 0.6, ease: 'quart.out' }, 0)
    }

    if (rightHeading) {
      gsap.set(rightHeading, { opacity: 0, y: 20 })
      tl.to(rightHeading, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.1)
    }

    if (wordmark) {
      gsap.set(wordmark, { opacity: 0, y: 40 })
      tl.to(wordmark, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 0.2)
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill()
      })
    }
  }, [pathname])

  return (
    <section ref={sectionRef} className={s.section}>

      {/* ─── FULL-BLEED VIDEO ─── */}
      <div className={s.videoWrap} aria-hidden="true">
        <video
          className={s.video}
          src={TRAIN_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
        <div className={s.videoOverlay} />
      </div>

      {/* ─── КОНТЕНТ — поверх видео ─── */}
      <div className={s.container}>

        {/* Верхняя строка: слева "Get on the train", справа ссылка */}
        <div className={s.topRow}>
          <span ref={leftLabelRef} className={s.leftLabel}>
            Get on the train
          </span>

          <Link
            ref={rightHeadingRef}
            href="/contact"
            className={s.rightHeading}
            aria-label="Work with us today"
          >
            Work with us today.
          </Link>
        </div>

        {/* Логотип Growdient внизу */}
        <div className={s.wordmarkRow}>
          <img
            ref={wordmarkRef}
            src="/growdient-logo.svg"
            alt="Growdient"
            className={s.wordmark}
          />
        </div>

        {/* Footer строка */}
        <div className={s.footer}>
          <span className={`label-small ${s.copyright}`}>
            © Growdient Studio {new Date().getFullYear()}
          </span>
          <div className={s.links}>
            <Link href="/about" className={`label-small ${s.footerLink}`}>About</Link>
            <Link href="/projects" className={`label-small ${s.footerLink}`}>Work</Link>
            <Link href="/blog" className={`label-small ${s.footerLink}`}>Blog</Link>
            <Link href="/contact" className={`label-small ${s.footerLink}`}>Contact</Link>
          </div>
        </div>

      </div>
    </section>
  )
}
