'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './ServicesSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    num: '01',
    title: 'Brand Identity',
    desc: "We shape visual brand identities that capture your brand\u2019s strategy, character and turn it into a memorable, ownable aesthetic language.",
  },
  {
    num: '02',
    title: 'Ui/Ux Design',
    desc: 'We design intuitive, high-end digital interfaces that blend clarity, aesthetics, and seamless user experience.',
  },
  {
    num: '03',
    title: 'Web Development',
    desc: 'We transform sophisticated UI into fully responsive, high-quality websites that feel as good as they look.',
  },
  {
    num: '04',
    title: 'Art Direction',
    desc: 'We shape the visual direction of your brand, ensuring every detail speaks a unified and elevated aesthetic language.',
  },
  {
    num: '05',
    title: 'Pitchdeck design',
    desc: 'We design visually striking, strategically structured pitch decks that communicate your idea with clarity and confidence.',
  },
]

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const label = labelRef.current
    const items = itemsRef.current
    if (!items) return

    const rows = items.querySelectorAll('[data-row]')

    if (label) {
      gsap.killTweensOf(label)
      gsap.set(label, { clearProps: 'y,opacity' })
      gsap.from(label, {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: 'quart.out',
        scrollTrigger: { trigger: label, start: 'top 88%', once: true },
      })
    }

    gsap.killTweensOf(rows)
    gsap.set(rows, { clearProps: 'y,opacity' })
    gsap.from(rows, {
      y: 32,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'quart.out',
      scrollTrigger: { trigger: items, start: 'top 80%', once: true },
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === label || st.trigger === items) st.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.container}>
        <div ref={labelRef} className={s.header}>
          <span className={`label-small ${s.label}`}>What we do</span>
        </div>

        <div ref={itemsRef} className={s.list}>
          {SERVICES.map((svc) => (
            <div key={svc.num} data-row className={s.row}>
              <div className={s.rowInner}>
                <h3 className={s.title}>{svc.title}</h3>
                <p className={s.desc}>{svc.desc}</p>
              </div>
              <div className={s.divider} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
