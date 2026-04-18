'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './AboutStatement.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function AboutStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const bigTextRef = useRef<HTMLDivElement>(null)
  const subTextRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const bigText = bigTextRef.current
    const subText = subTextRef.current
    const cta = ctaRef.current
    if (!section) return

    if (bigText) {
      const words = bigText.querySelectorAll('[data-word]')
      gsap.set(words, { clipPath: 'inset(100% 0 0 0)', y: 24 })
      gsap.to(words, {
        clipPath: 'inset(0% 0 0 0)',
        y: 0,
        stagger: 0.06,
        duration: 1.0,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: bigText,
          start: 'top 75%',
          once: true,
        },
      })
    }

    if (subText) {
      gsap.from(subText, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'quart.out',
        scrollTrigger: {
          trigger: subText,
          start: 'top 85%',
          once: true,
        },
      })
    }

    if (cta) {
      gsap.from(cta, {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: 'quart.out',
        scrollTrigger: {
          trigger: cta,
          start: 'top 90%',
          once: true,
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (
          st.trigger === bigText ||
          st.trigger === subText ||
          st.trigger === cta
        )
          st.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.container}>

        {/* Big statement — text-h0 size, Instrument Serif */}
        <div ref={bigTextRef} className={s.bigText}>
          {['We', 'merge', 'instinct', 'with', 'intelligence'].map((word) => (
            <span key={word} data-word className={s.word}>
              {word}
            </span>
          ))}
        </div>

        {/* Sub-text — body copy, Webflow: .text-block-2 */}
        <div className={s.bottom}>
          <p ref={subTextRef} className={`text-block-2 ${s.subText}`}>
            Human+Machine© is a concept born from the fusion of bold ideas and
            cutting-edge technology. We design experiences that merge human
            intuition with AI precision — building brands, crafting immersive
            campaigns, and shaping digital worlds that stand out.
          </p>

          <div ref={ctaRef} className={s.cta}>
            <Link href="/about" className={`label-small ${s.ctaLink}`}>
              Our story →
            </Link>
          </div>
        </div>

        {/* Industries tag */}
        <div className={s.industries}>
          <span className={`label-small ${s.industriesLabel}`}>
            We partner across many industries:
          </span>
          <p className={`text-block-2 ${s.industriesList}`}>
            Hospitality · Retail · AI-Startups · Web3 · Ecommerce · Healthcare
          </p>
        </div>
      </div>
    </section>
  )
}
