'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './StudioIntro.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function StudioIntro() {
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return

    gsap.killTweensOf(el)
    gsap.set(el, { clearProps: 'y,opacity' })
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [])

  return (
    <section className={s.section} aria-label="Studio introduction">
      <div className={s.container}>
        <h2 ref={textRef} className={s.text}>
          Growdient is a design studio turning brand identity design and web
          development into value. We build bright brands, modern websites, and
          scalable design systems for brands who value clarity and measurable
          impact.
        </h2>
      </div>
    </section>
  )
}
