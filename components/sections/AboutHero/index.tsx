'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import s from './AboutHero.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

const CDN = 'https://cdn.prod.website-files.com/69273d885ceeda5caa00a47e'

const PHRASES = [
  'Merging high class design services in one vision for brands and products who value clarity and measurable impact.',
  'We are working with limitless design possibilities for brands and products worldwide',
  'We build standout brands, lightning-fast websites, and scalable design systems',
]

export default function AboutHero() {
  const sectionRef   = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const leftTextRef  = useRef<HTMLDivElement>(null)
  const rightTextRef = useRef<HTMLDivElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)

  const panel1Ref  = useRef<HTMLDivElement>(null)
  const panel2Ref  = useRef<HTMLDivElement>(null)
  const panel3Ref  = useRef<HTMLDivElement>(null)
  const phrase1Ref = useRef<HTMLParagraphElement>(null)
  const phrase2Ref = useRef<HTMLParagraphElement>(null)
  const phrase3Ref = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const section   = sectionRef.current
    const imageWrap = imageWrapRef.current
    const leftText  = leftTextRef.current
    const rightText = rightTextRef.current
    const overlay   = overlayRef.current
    if (!section || !imageWrap || !leftText || !rightText || !overlay) return

    // ─── Load: image scales up, text slides in ───────────────────────────────
    gsap.set(imageWrap, { xPercent: -50, yPercent: -50, scale: 0.88, opacity: 0, filter: 'blur(0px)' })
    gsap.set(leftText,  { x: 80 })
    gsap.set(rightText, { x: -80 })

    const loadTl = gsap.timeline({ delay: 0.15 })
    loadTl
      .to(imageWrap, { scale: 1, opacity: 1, duration: 0.9, ease: 'sine.out' }, 0)
      .to(leftText,  { x: 0, duration: 1.1, ease: 'power2.out' }, 0.05)
      .to(rightText, { x: 0, duration: 1.1, ease: 'power2.out' }, 0.05)

    const splits: SplitText[] = []
    let scrollTl: gsap.core.Timeline

    // setTimeout(100) lets all useEffects settle (scroll reset, destroyIX3) before
    // we measure layout. CSS module chunks load async on client navigation in
    // production — at t=0 styles may not yet be applied.
    //
    // We use `to()` (not `fromTo`) + `invalidateOnRefresh: true` so that when
    // PageTransition.onComplete fires ScrollTrigger.refresh() at ~700ms (curtain
    // gone, CSS definitely loaded), the `onRefresh` callback clears GSAP inline
    // styles and `invalidate()` re-reads true CSS dimensions as the "from" state.
    // This is the only moment we can guarantee correct values before the first scroll.
    const timerId = setTimeout(() => {
      ScrollTrigger.refresh()

      // ─── Scroll: image expands → fullscreen → blur ─────────────────────
      scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: () => {
            // Clear GSAP inline styles so the element's CSS values are the "from"
            // state when tweens re-initialize after invalidate().
            gsap.set(imageWrap, { clearProps: 'width,height,borderRadius' })
          },
        },
      })
      scrollTl
        .to(imageWrap, { width: '100vw', height: '100vh', duration: 0.6, ease: 'none' }, 0)
        .to(imageWrap, { borderRadius: '0px', duration: 0.6, ease: 'none' }, 0)
        .fromTo(leftText,  { x: 0 }, { x: '-45vw', duration: 0.45, ease: 'none' }, 0)
        .fromTo(rightText, { x: 0 }, { x:  '45vw', duration: 0.45, ease: 'none' }, 0)
        .fromTo(imageWrap, { filter: 'blur(0px)' }, { filter: 'blur(24px)', duration: 0.4, ease: 'sine.in' }, 0.6)

      // ─── Phrase panels: chars reveal gray → white ──────────────────────
      const panelData = [
        { panel: panel1Ref.current, phrase: phrase1Ref.current },
        { panel: panel2Ref.current, phrase: phrase2Ref.current },
        { panel: panel3Ref.current, phrase: phrase3Ref.current },
      ]

      panelData.forEach(({ panel, phrase }) => {
        if (!panel || !phrase) return

        const split = new SplitText(phrase, { type: 'chars,words', wordsClass: 'word-wrap' })
        splits.push(split)

        split.chars.forEach((char) => {
          gsap.fromTo(char,
            { opacity: 0.3 },
            {
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: char,
                start: 'bottom bottom',
                end: 'bottom 40%',
                scrub: true,
              },
            }
          )
        })
      })
    })

    return () => {
      clearTimeout(timerId)
      loadTl.kill()
      scrollTl?.kill()
      splits.forEach((sp) => sp.revert())
      ScrollTrigger.getAll().forEach((st) => {
        const panelEls = [panel1Ref.current, panel2Ref.current, panel3Ref.current]
        if (st.trigger === section || panelEls.includes(st.trigger as HTMLDivElement)) st.kill()
      })
      gsap.set([imageWrap, leftText, rightText, overlay], { clearProps: 'all' })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={s.section}
      aria-label="About — We are Growdient"
    >
      {/* ─── Sticky viewport ─── */}
      <div className={s.sticky}>

        {/* WE ARE — left */}
        <div ref={leftTextRef} className={s.leftText} aria-hidden="true">
          WE ARE
        </div>

        {/* Center image */}
        <div ref={imageWrapRef} className={s.imageWrap}>
          <Image
            src={`${CDN}/69273d8a5ceeda5caa00a712_ContactImage2.webp`}
            alt="Growdient Studio team"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={s.image}
            priority
          />
        </div>

        {/* GROWDIENT — right */}
        <div ref={rightTextRef} className={s.rightText} aria-hidden="true">
          GROWDIENT
        </div>

        {/* Dark overlay */}
        <div
          ref={overlayRef}
          className={`${s.overlay} overlay-about-image`}
          aria-hidden="true"
        />

        <h1 className={s.srOnly}>We are Growdient</h1>
      </div>

      {/* ─── Phrase panels (scroll over blurred image) ─── */}
      <div ref={panel1Ref} className={s.panel}>
        <div className={s.panelInner}>
          <p ref={phrase1Ref} className={s.panelText}>{PHRASES[0]}</p>
        </div>
      </div>

      <div ref={panel2Ref} className={s.panel}>
        <div className={s.panelInner}>
          <p ref={phrase2Ref} className={s.panelText}>{PHRASES[1]}</p>
        </div>
      </div>

      <div ref={panel3Ref} className={s.panel}>
        <div className={s.panelInner}>
          <p ref={phrase3Ref} className={s.panelText}>{PHRASES[2]}</p>
        </div>
      </div>
    </section>
  )
}
