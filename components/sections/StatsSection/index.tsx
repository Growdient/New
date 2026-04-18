'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './StatsSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { label: 'BRANDING',      value: '200+', tileClass: s.tileLeft },
  { label: 'WEBSITES',      value: '50+',  tileClass: s.tileCenter },
  { label: 'ART DIRECTION', value: '100+', tileClass: s.tileRight },
]

export default function StatsSection() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const tiles = grid.querySelectorAll('[data-tile]')

    gsap.killTweensOf(tiles)
    gsap.set(tiles, { clearProps: 'y,opacity' })
    gsap.from(tiles, {
      y: 56,
      opacity: 0,
      stagger: 0.15,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 82%',
        once: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === grid) st.kill()
      })
    }
  }, [])

  return (
    <section className={s.section}>
      <div className={s.container}>
        <div ref={gridRef} className={s.grid}>
          {STATS.map((stat) => (
            <div
              key={stat.label}
              data-tile
              className={`${s.tile} ${stat.tileClass}`}
            >
              <div className={s.label}>{stat.label}</div>
              <div className={s.number}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
