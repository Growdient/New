'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import s from './WorkHero.module.css'

const HEADLINE = 'Selected works from branding to digital with strong visual taste'

export default function WorkHero() {
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = headlineRef.current
    if (!el) return

    const words = HEADLINE.split(' ')
    el.innerHTML = words
      .map((w) => `<span class="${s.wordWrap}"><span class="${s.word}">${w}</span></span>`)
      .join(' ')

    const wordEls = el.querySelectorAll(`.${s.word}`)
    gsap.set(wordEls, { y: '110%' })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(wordEls, {
      y: '0%',
      stagger: 0.045,
      duration: 1.0,
      delay: 0.2,
    })

    return () => { tl.kill() }
  }, [])

  return (
    <div className={s.hero}>
      <div className={s.sticky} data-work-hero-blur>
        <h1
          ref={headlineRef}
          className={s.headline}
        >
          {HEADLINE}
        </h1>
      </div>
    </div>
  )
}
