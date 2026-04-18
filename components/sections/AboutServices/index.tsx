'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './AboutServices.module.css'

gsap.registerPlugin(ScrollTrigger)

const CDN = 'https://cdn.prod.website-files.com/69273d885ceeda5caa00a47e'

const SERVICES = [
  {
    num: '01',
    title: 'Brand Identity',
    desc: 'We shape visual brand identities that capture your brand\'s strategy, character and turn it into a memorable, ownable aesthetic language.',
    image: `${CDN}/692884cd694a5c8559b3cd39_w1se_boxes_post.webp`,
    imageAlt: 'Brand Identity project',
  },
  {
    num: '02',
    title: 'UI/UX Design',
    desc: 'We design intuitive, high-end digital interfaces that blend clarity, aesthetics, and seamless user experience.',
    image: `${CDN}/69289317f1241f05a62a08a9_1.webp`,
    imageAlt: 'UI/UX Design project',
  },
  {
    num: '03',
    title: 'Web Development',
    desc: 'We transform sophisticated UI into fully responsive, high-quality websites that feel as good as they look.',
    image: `${CDN}/6932c7847a6955dd85c9691c_2.avif`,
    imageAlt: 'Web Development project',
  },
  {
    num: '04',
    title: 'Art Direction',
    desc: 'We shape the visual direction of your brand, ensuring every detail speaks a unified and elevated aesthetic language.',
    image: `${CDN}/6932c7acf26191a6a29c54e5_2.webp`,
    imageAlt: 'Art Direction project',
  },
  {
    num: '05',
    title: 'Pitchdeck Design',
    desc: 'We design visually striking, strategically structured pitch decks that communicate your idea with clarity and confidence.',
    image: `${CDN}/6932cdb1f16db9863a353b5d_6.webp`,
    imageAlt: 'Pitchdeck Design project',
  },
]

export default function AboutServices() {
  const sectionRef  = useRef<HTMLElement>(null)
  const labelRef    = useRef<HTMLSpanElement>(null)
  const listRef     = useRef<HTMLUListElement>(null)
  // Cursor-follow image state
  const floatImgRef = useRef<HTMLDivElement>(null)
  const activeIndex = useRef<number>(-1)

  useEffect(() => {
    const section  = sectionRef.current
    const label    = labelRef.current
    const list     = listRef.current
    const floatImg = floatImgRef.current
    if (!section || !list || !floatImg) return

    const triggers: ScrollTrigger[] = []
    const rafIds: number[] = []

    // ─── Label entrance ──────────────────────────────────────────────────────
    if (label) {
      gsap.from(label, {
        y: 16, opacity: 0, duration: 0.7, ease: 'quart.out',
        scrollTrigger: { trigger: label, start: 'top 88%', once: true },
      })
    }

    // ─── Each row: stagger entrance ──────────────────────────────────────────
    const rows = list.querySelectorAll(`.${s.item}`)
    rows.forEach((row, i) => {
      const st = ScrollTrigger.create({
        trigger: row,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.fromTo(row,
            { y: 32, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out', delay: i * 0.04 }
          )
        },
      })
      triggers.push(st)
    })

    // ─── Floating image follows cursor inside each row ────────────────────────
    let mouseX = 0, mouseY = 0
    let imgX = 0, imgY = 0
    let currentSrc = ''
    let raf: number

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

    function animateFloat() {
      imgX = lerp(imgX, mouseX, 0.1)
      imgY = lerp(imgY, mouseY, 0.1)
      gsap.set(floatImg, { x: imgX, y: imgY })
      raf = requestAnimationFrame(animateFloat)
    }
    raf = requestAnimationFrame(animateFloat)
    rafIds.push(raf)

    rows.forEach((row, i) => {
      const imgEl = floatImg.querySelector('img') as HTMLImageElement | null

      row.addEventListener('mouseenter', (e: Event) => {
        const me = e as MouseEvent
        mouseX = me.clientX - (floatImg.offsetWidth / 2)
        mouseY = me.clientY - (floatImg.offsetHeight / 2)
        imgX = mouseX; imgY = mouseY  // snap to cursor on first enter

        if (imgEl && currentSrc !== SERVICES[i].image) {
          currentSrc = SERVICES[i].image
          imgEl.src = currentSrc
        }
        activeIndex.current = i
        gsap.to(floatImg, { opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' })
        gsap.to(row.querySelector(`.${s.num}`), { opacity: 1, duration: 0.3 })
        gsap.to(row.querySelector(`.${s.rowTitle}`), { x: 12, duration: 0.4, ease: 'expo.out' })
      })

      row.addEventListener('mousemove', (e: Event) => {
        const me = e as MouseEvent
        mouseX = me.clientX - (floatImg.offsetWidth / 2)
        mouseY = me.clientY - (floatImg.offsetHeight / 2)
      })

      row.addEventListener('mouseleave', () => {
        gsap.to(floatImg, { opacity: 0, scale: 0.92, duration: 0.3, ease: 'sine.inOut' })
        gsap.to(row.querySelector(`.${s.rowTitle}`), { x: 0, duration: 0.35, ease: 'expo.out' })
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      triggers.forEach((st) => st.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section} aria-label="Our services">

      {/* Section label */}
      <div className={s.header}>
        <div className={s.headerInner}>
          <span ref={labelRef} className={`label-small ${s.sectionLabel}`}>
            What we do
          </span>
        </div>
      </div>

      {/* Services list */}
      <ul ref={listRef} className={s.list} role="list">
        {SERVICES.map((service) => (
          <li key={service.num} className={s.item}>
            <div className={s.itemInner}>
              <span className={`${s.num} label-small`}>{service.num}</span>
              <span className={s.rowTitle}>{service.title}</span>
              <p className={`${s.desc} text-block-2`}>{service.desc}</p>
            </div>
            <div className={s.divider} aria-hidden="true" />
          </li>
        ))}
      </ul>

      {/* Floating cursor image */}
      <div ref={floatImgRef} className={s.floatImg} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SERVICES[0].image}
          alt=""
          className={s.floatImgEl}
        />
      </div>

    </section>
  )
}
