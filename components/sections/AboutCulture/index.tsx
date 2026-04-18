'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './AboutCulture.module.css'

gsap.registerPlugin(ScrollTrigger)

const CDN = 'https://cdn.prod.website-files.com/69273d885ceeda5caa00a47e'

// 3 culture photos, duplicated for seamless infinite loop
const CULTURE_IMAGES = [
  {
    src: `${CDN}/69273d8a5ceeda5caa00a713_ContactImage5.webp`,
    caption: 'Yeah, we like metal',
  },
  {
    src: `${CDN}/69273d8a5ceeda5caa00a71a_d3bef2a98f94461af1e725a57f9f382e31bfa1ab.webp`,
    caption: 'We love chairs',
  },
  {
    src: `${CDN}/69273d8a5ceeda5caa00a71b_7e1e97d6bc61d65200f6fd440ff37342f75efdae.webp`,
    caption: 'Our hall has plants',
  },
]

// Duplicate for seamless CSS loop
const ITEMS = [...CULTURE_IMAGES, ...CULTURE_IMAGES, ...CULTURE_IMAGES]

export default function AboutCulture() {
  const sectionRef  = useRef<HTMLElement>(null)
  const labelRef    = useRef<HTMLSpanElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const label = labelRef.current
    if (!label) return

    gsap.from(label, {
      y: 16, opacity: 0, duration: 0.8, ease: 'quart.out',
      scrollTrigger: { trigger: label, start: 'top 88%', once: true },
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === label) st.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section} aria-label="Studio culture">

      {/* Header */}
      <div className={s.header}>
        <div className={s.headerInner}>
          <span ref={labelRef} className={`label-small ${s.sectionLabel}`}>
            Culture
          </span>
        </div>
      </div>

      {/* Infinite marquee of culture photos */}
      <div className={s.marqueeOuter} aria-hidden="true">
        <div ref={trackRef} className={`${s.marqueeTrack} marquee-images`}>
          {ITEMS.map((item, i) => (
            <div key={i} className={s.photoItem}>
              <div className={s.photoWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.caption}
                  className={s.photo}
                  loading="lazy"
                />
              </div>
              <span className={`label-small ${s.caption}`}>{item.caption}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
