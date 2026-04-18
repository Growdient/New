'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import s from './BlogHero.module.css'

interface BlogHeroProps {
  postCount: number
}

export default function BlogHero({ postCount }: BlogHeroProps) {
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    const buildWordMask = (el: HTMLSpanElement | null, delay: number) => {
      if (!el) return
      const text = el.dataset.text ?? ''
      const words = text.split(' ')
      el.innerHTML = words
        .map((w) => `<span class="${s.wordWrap}"><span class="${s.word}">${w}</span></span>`)
        .join(' ')
      const wordEls = el.querySelectorAll(`.${s.word}`)
      gsap.set(wordEls, { y: '110%' })
      tl.to(wordEls, { y: '0%', stagger: 0.05, duration: 1.1 }, delay)
    }

    buildWordMask(line1Ref.current, 0.08)
    buildWordMask(line2Ref.current, 0.22)

    return () => { tl.kill() }
  }, [])

  return (
    <header className={s.hero}>
      <div className={s.inner}>

        <h1 className={s.headline} aria-label="Learning Design Blog">
          <span ref={line1Ref} className={s.line} data-text="Learning" />
          {' '}
          <span ref={line2Ref} className={`${s.line} ${s.lineAccent}`} data-text="Design Blog" />
        </h1>

      </div>
    </header>
  )
}
