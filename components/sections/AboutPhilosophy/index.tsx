'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import s from './AboutPhilosophy.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

const CDN = 'https://cdn.prod.website-files.com/69273d885ceeda5caa00a47e'

export default function AboutPhilosophy() {
  const sectionRef     = useRef<HTMLElement>(null)
  const headlineRef    = useRef<HTMLHeadingElement>(null)
  const subTagRef      = useRef<HTMLSpanElement>(null)
  const bodyRef        = useRef<HTMLParagraphElement>(null)
  const leftImageRef   = useRef<HTMLDivElement>(null)
  const rightImageRef  = useRef<HTMLDivElement>(null)
  const trackTextRef   = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section    = sectionRef.current
    const headline   = headlineRef.current
    const subTag     = subTagRef.current
    const body       = bodyRef.current
    const leftImage  = leftImageRef.current
    const rightImage = rightImageRef.current
    const trackText  = trackTextRef.current
    if (!section) return

    const triggers: ScrollTrigger[] = []

    // ─── Headline: char-by-char scrub reveal ────────────────────────────────
    if (headline) {
      const split = new SplitText(headline, { type: 'chars' })
      gsap.set(split.chars, { opacity: 0.2 })
      const st = ScrollTrigger.create({
        trigger: headline,
        start: 'top 85%',
        end: 'bottom 40%',
        scrub: 0.8,
        animation: gsap.to(split.chars, {
          opacity: 1,
          stagger: { each: 0.05 },
          ease: 'none',
        }),
        onLeave: () => split.revert(),
      })
      triggers.push(st)
    }

    // ─── Sub-tag + body: fade up ─────────────────────────────────────────────
    ;[subTag, body].forEach((el) => {
      if (!el) return
      gsap.from(el, {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: 'quart.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    })

    // ─── Images: scale up from below ─────────────────────────────────────────
    ;[leftImage, rightImage].forEach((el, i) => {
      if (!el) return
      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        delay: i * 0.12,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      })
    })

    // ─── Text track: char-by-char scrub (`.text-track-about` pattern) ────────
    if (trackText) {
      const split = new SplitText(trackText, { type: 'chars' })
      gsap.set(split.chars, { opacity: 0.28 })
      const st = ScrollTrigger.create({
        trigger: trackText,
        start: 'top bottom',
        end: 'bottom 40%',
        scrub: 0.9,
        animation: gsap.to(split.chars, {
          opacity: 1,
          stagger: { each: 0.08 },
          ease: 'none',
        }),
        onLeave: () => split.revert(),
      })
      triggers.push(st)
    }

    return () => {
      triggers.forEach((st) => st.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section} aria-label="Our philosophy">

      {/* ─── BIG STATEMENT HEADLINE ─── */}
      <div className={s.headlineWrap}>
        <div className={s.headlineContainer}>
          <h2 ref={headlineRef} className={s.headline}>
            We build where human instinct meets machine intelligence
          </h2>
        </div>
      </div>

      {/* ─── IMAGES + PHILOSOPHY COPY ─── */}
      <div className={s.storyGrid}>
        {/* Left image */}
        <div ref={leftImageRef} className={s.leftImageWrap}>
          <div className={s.imageOuter}>
            <Image
              src={`${CDN}/69273d8a5ceeda5caa00a719_StoryLeft.webp`}
              alt="Growdient philosophy — human design"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className={s.storyImage}
            />
          </div>
        </div>

        {/* Right copy block */}
        <div className={s.storyRight}>
          <span ref={subTagRef} className={`label-small ${s.subTag}`}>
            99% human + 1% robot magic
          </span>
          <p ref={bodyRef} className={`text-block-2 ${s.storyBody}`}>
            We're not just a studio — we're a concept, a method, and a
            playground for bold ideas. Human+Machine© is built for brands that
            want to merge emotion with technology, stories with data, and
            intuition with precision.
          </p>

          {/* Right image */}
          <div ref={rightImageRef} className={s.rightImageWrap}>
            <div className={s.imageOuter}>
              <Image
                src={`${CDN}/69273d8a5ceeda5caa00a70f_ContactImage3.webp`}
                alt="Growdient Studio — digital craftsmanship"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className={s.storyImage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── LONG TRACK TEXT — char-by-char scrub reveal ─── */}
      <div className={`${s.trackWrap} wrap-home-about`}>
        <div className={s.trackInner}>
          <p
            ref={trackTextRef}
            className={`${s.trackText} text-track-about`}
          >
            We design experiences that merge human intuition with AI precision
            — building brands, crafting immersive campaigns, and shaping
            digital worlds that stand out in a sea of sameness. Bold.
            Intentional. Built to last.
          </p>
        </div>
      </div>

    </section>
  )
}
