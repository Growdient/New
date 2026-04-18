'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

const HERO_TITLE = 'HELLO, WE ARE GROWDIENT STUDIO.'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const titleEl = titleRef.current
    const section = sectionRef.current

    if (!titleEl) return

    const words = HERO_TITLE.split(' ')
    titleEl.innerHTML = words
      .map((w) => `<span class="${s.wordWrap}"><span class="${s.word}">${w}</span></span>`)
      .join(' ')

    const wordEls = titleEl.querySelectorAll(`.${s.word}`)

    gsap.set(wordEls, { y: '110%', rotation: 3, opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    tl.to(wordEls, {
      y: '0%',
      rotation: 0,
      opacity: 1,
      stagger: 0.055,
      duration: 0.9,
      delay: 0.15,
      onComplete: () => { gsap.set(wordEls, { willChange: 'auto' }) },
    })

    if (section && !window.matchMedia('(pointer: coarse)').matches) {
      gsap.to(titleEl, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.hero} aria-label="Hero">
      <div className={s.videoWrap} aria-hidden="true">
        <video
          className={s.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source
            src="https://cdn.prod.website-files.com/69273d885ceeda5caa00a47e%2F69433902e57321daea06fe09_Whisk_ydzlrtowgtyxmgnx0snxgtytqdolrtljnjzi1so_webm.webm"
            type="video/webm"
          />
          <source
            src="https://cdn.prod.website-files.com/69273d885ceeda5caa00a47e%2F69433902e57321daea06fe09_Whisk_ydzlrtowgtyxmgnx0snxgtytqdolrtljnjzi1so_mp4.mp4"
            type="video/mp4"
          />
        </video>
        <div className={s.overlay} />
      </div>

      <div className={s.wrap}>
        <h1
          ref={titleRef}
          className={`heading ${s.title}`}
          aria-label={HERO_TITLE}
        >
          {HERO_TITLE}
        </h1>
      </div>
    </section>
  )
}
