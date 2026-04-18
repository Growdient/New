'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import s from './AboutTeam.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

const CDN = 'https://cdn.prod.website-files.com/69273d885ceeda5caa00a47e'

const TEAM = [
  {
    name: 'SASHA',
    role: 'Art Director',
    image: `${CDN}/693760b91d779897454d53f2_me.webp`,
  },
  {
    name: 'DANIIL',
    role: 'Head of Graphic Design',
    image: `${CDN}/6937682e079034203eb6595a_danil.webp`,
  },
  {
    name: 'DENIS',
    role: 'Head of UI/UX Design',
    image: `${CDN}/693768a78e7a1451bce22bdc_denis.webp`,
  },
  {
    name: 'NOA',
    role: 'Bizdev Partner / Canada',
    image: `${CDN}/693766fc08f4d119ab042444_noa2.webp`,
  },
  {
    name: 'ANASTASIA',
    role: 'Marketing Partner / Ukraine',
    image: `${CDN}/69375b8c18b7879ba00e235d_0b8b5bb05a6e8531fa4483c14db5aabd_nastya.jpg`,
  },
  {
    name: 'ANDY',
    role: 'Head of Web Development',
    image: `${CDN}/69273d8a5ceeda5caa00a71d_TeamImage-7.webp`,
  },
]

export default function AboutTeam() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const headline = headlineRef.current
    const grid     = gridRef.current
    if (!grid) return

    // ─── Headline word-mask entrance ─────────────────────────────────────────
    if (headline) {
      const words = headline.textContent!.trim().split(' ')
      headline.innerHTML = ''
      words.forEach((w, i) => {
        const wrap = document.createElement('span')
        wrap.className = s.wordWrap
        const inner = document.createElement('span')
        inner.className = s.word
        inner.textContent = w
        wrap.appendChild(inner)
        if (i < words.length - 1) {
          headline.appendChild(wrap)
          headline.insertAdjacentText('beforeend', ' ')
        } else {
          headline.appendChild(wrap)
        }
      })
      const wordEls = headline.querySelectorAll(`.${s.word}`)
      gsap.set(wordEls, { y: '110%', opacity: 0 })
      gsap.to(wordEls, {
        y: '0%',
        opacity: 1,
        stagger: 0.055,
        duration: 1.0,
        ease: 'expo.out',
        scrollTrigger: { trigger: headline, start: 'top 82%', once: true },
      })
    }

    // ─── Cards: stagger entrance ──────────────────────────────────────────────
    const cards = grid.querySelectorAll(`.${s.card}`)
    gsap.killTweensOf(cards)
    gsap.set(cards, { clearProps: 'y,opacity' })
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 48,
        opacity: 0,
        duration: 1.0,
        ease: 'expo.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: grid, start: 'top 82%', once: true },
      })
    })

    // ─── Card hover: image scale ──────────────────────────────────────────────
    const hoverTls: gsap.core.Timeline[] = []
    cards.forEach((card) => {
      const img = card.querySelector(`.${s.cardImage}`) as HTMLElement | null
      if (!img) return
      const tl = gsap.timeline({ paused: true })
      tl.to(img, { scale: 1.06, duration: 0.6, ease: 'sine.inOut' }, 0)
      card.addEventListener('mouseenter', () => tl.play())
      card.addEventListener('mouseleave', () => tl.reverse())
      hoverTls.push(tl)
    })

    return () => {
      hoverTls.forEach((tl) => tl.kill())
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === headline || st.trigger === grid) st.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section} aria-label="Our team">
      <div className={s.container}>

        {/* Headline */}
        <h2 ref={headlineRef} className={s.headline}>
          Team that grows brands
        </h2>

        {/* Team grid */}
        <div ref={gridRef} className={s.grid}>
          {TEAM.map((member) => (
            <div key={member.name} className={s.card}>
              <div className={s.imageWrap}>
                <Image
                  src={member.image}
                  alt={`${member.name} — ${member.role}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={s.cardImage}
                />
              </div>
              <div className={s.cardMeta}>
                <span className={s.memberName}>{member.name}</span>
                <span className={`label-small ${s.memberRole}`}>{member.role}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
