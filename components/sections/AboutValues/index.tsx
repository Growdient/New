'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './AboutValues.module.css'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  {
    num: '01',
    title: 'Creativity + AI',
    tagline: 'We believe tech should amplify human vision, not replace it.',
  },
  {
    num: '02',
    title: 'Speed + Depth',
    tagline: 'Fast execution with ideas that actually last.',
  },
  {
    num: '03',
    title: 'Clarity + Soul',
    tagline: 'Every project must feel alive and authentic.',
  },
]

export default function AboutValues() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const grid  = gridRef.current
    const label = labelRef.current
    if (!grid) return

    if (label) {
      gsap.from(label, {
        y: 16, opacity: 0, duration: 0.7, ease: 'quart.out',
        scrollTrigger: { trigger: label, start: 'top 88%', once: true },
      })
    }

    const cards = grid.querySelectorAll(`.${s.card}`)
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 56,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: grid, start: 'top 82%', once: true },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === grid || st.trigger === label) st.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section} aria-label="Our values">

      <div className={s.container}>
        <div className={s.topRow}>
          <span ref={labelRef} className={`label-small ${s.sectionLabel}`}>
            What we stand for
          </span>
        </div>

        <div ref={gridRef} className={s.grid}>
          {VALUES.map((v) => (
            <div key={v.num} className={s.card}>
              <span className={`label-small ${s.cardNum}`}>{v.num}</span>
              <h3 className={s.cardTitle}>{v.title}</h3>
              <p className={`text-block-2 ${s.cardTagline}`}>{v.tagline}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
