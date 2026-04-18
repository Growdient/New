'use client'

import { useRef, useEffect } from 'react'
import s from './ContactHero.module.css'

const CDN = 'https://cdn.prod.website-files.com/69273d885ceeda5caa00a47e'
const LEGAL_DOTS = `${CDN}/69273d8a5ceeda5caa00a6f7_Legal%20Dots.svg`

export default function ContactHero() {
  const gridRef    = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // ─── Heading entrance ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    import('gsap').then(({ default: gsap }) => {
      // Clear any stale inline styles from a previous mount before animating
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'y,opacity' })
      gsap.from(el, { y: 24, opacity: 0, duration: 1.0, ease: 'expo.out', delay: 0.15 })
    })
  }, [])

  // ─── Contact grid tiles reveal ────────────────────────────────────────────
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    import('gsap').then(({ default: gsap }) => {
      const tiles = Array.from(grid.querySelectorAll(':scope > div, :scope > a'))
      // Clear stale inline styles so from() captures correct natural CSS values
      gsap.killTweensOf(tiles)
      gsap.set(tiles, { clearProps: 'y,opacity' })
      gsap.from(tiles, {
        y: 32, opacity: 0, duration: 0.9, stagger: 0.1,
        ease: 'expo.out', delay: 0.3,
      })
    })
  }, [])

  return (
    <section className={s.section} aria-label="Contact">

      {/* ─── Legal Dots ─── */}
      <div className={s.dots} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LEGAL_DOTS} alt="" className={s.dotsImg} />
      </div>

      {/* ─── Main content ─── */}
      <div className={s.container}>

        {/* Upper half — heading at center */}
        <div className={s.upperHalf}>
          <h1 ref={headingRef} className={s.heroHeading}>Let&rsquo;s make a project</h1>
        </div>

        {/* Lower half — grid 10% below center line */}
        <div className={s.lowerHalf}>
          <div ref={gridRef} className={s.grid}>

            {/* Lisbon */}
            <div className={s.tile}>
              <span className={s.tileCity}>Lisbon</span>
              <div className={s.tileLinks}>
                <a href="mailto:info@growdient.com" className={s.link}>
                  info@growdient.com
                </a>
                <div className={s.linkRow}>
                  <a href="tel:+351910144205" className={s.linkTel}>+351910144205</a>
                  <a href="https://wa.me/351910144205" target="_blank" rel="noopener noreferrer" className={s.linkWa}>
                    Whatsapp
                  </a>
                </div>
              </div>
            </div>

            {/* Kyiv */}
            <div className={s.tile}>
              <span className={s.tileCity}>Kyiv</span>
              <div className={s.tileLinks}>
                <a href="mailto:hi@growdient.com" className={s.link}>
                  hi@growdient.com
                </a>
                <div className={s.linkRow}>
                  <a href="tel:+380675621645" className={s.linkTel}>+380675621645</a>
                  <a href="https://wa.me/380675621645" target="_blank" rel="noopener noreferrer" className={s.linkWa}>
                    Whatsapp
                  </a>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className={s.tile}>
              <a href="https://www.linkedin.com/company/growdient" target="_blank" rel="noopener noreferrer" className={s.tileCityLink}>
                Linkedin
              </a>
              <a href="https://www.instagram.com/growdient" target="_blank" rel="noopener noreferrer" className={s.tileCityLink}>
                Instagram
              </a>
            </div>

            {/* 4th col — hidden, keeps grid structure */}
            <div aria-hidden="true" />

          </div>
        </div>

      </div>

    </section>
  )
}
