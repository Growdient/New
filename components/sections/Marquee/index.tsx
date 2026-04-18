'use client'

import { useRef, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Marquee.module.css'

gsap.registerPlugin(ScrollTrigger)

const MARQUEE_ITEMS = [
  'Brand Identity',
  'UI/UX Design',
  'Web Development',
  'Art Direction',
]

const SEPARATOR = '+'

function MarqueeTrack() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <div className={s.track} aria-hidden="true">
      {items.map((item, i) => (
        <span key={i} className={`marquee-text-large ${s.item}`}>
          {item}
          <span className={s.separator}>{SEPARATOR}</span>
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const outerRef  = useRef<HTMLDivElement>(null)
  const rowRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spacer = spacerRef.current
    const outer  = outerRef.current
    if (!spacer || !outer) return

    const reel = document.querySelector(
      '[data-section="projects-reel"]'
    ) as HTMLElement | null
    if (!reel) return

    // ─── Геометрическая калибровка ──────────────────────────────────────────
    //
    // Цель: outer.offsetTop = reel.offsetTop + window.innerHeight
    //
    //   gap = vh - reel.offsetHeight
    //   gap > 0 → spacer заполняет разрыв; outer.marginTop = 0
    //   gap < 0 → spacer = 0; outer.marginTop = gap (перекрытие нижнего padding)
    //
    let refreshTimer: ReturnType<typeof setTimeout>

    const projectGrid = document.querySelector(
      '[data-section="project-grid"]'
    ) as HTMLElement | null

    const calibrate = () => {
      const vh      = window.innerHeight
      const reelH   = reel.offsetHeight
      const gap     = vh - reelH
      const mobile  = window.innerWidth <= 640

      if (mobile) {
        // Маркиза скрыта на mobile через CSS — сбрасываем все JS-стили
        spacer.style.height   = '0px'
        outer.style.height    = '0px'
        outer.style.marginTop = '0px'
        if (projectGrid) projectGrid.style.marginTop = '0px'
        clearTimeout(refreshTimer)
        refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 60)
        return
      }

      // Desktop: spacer заполняет gap, outer даёт scroll-пространство для sticky
      const maxSpacer   = Number.MAX_SAFE_INTEGER
      const scrollSpace = Math.round(vh * 0.25)
      spacer.style.height   = `${Math.min(maxSpacer, Math.max(0, gap))}px`
      outer.style.marginTop = `${Math.min(0, gap)}px`

      const gridH = projectGrid?.offsetHeight ?? 0
      outer.style.height = `${scrollSpace + gridH}px`
      if (projectGrid) projectGrid.style.marginTop = `-${gridH}px`

      clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 60)
    }

    calibrate()

    const ro = new ResizeObserver(calibrate)
    ro.observe(reel)
    window.addEventListener('resize', calibrate)

    // ─── ScrollTrigger: play/pause бегущей строки ─────────────────────────
    // IntersectionObserver ломается на mobile из-за Lenis/native scroll desync.
    // GSAP ScrollTrigger уже синхронизирован с Lenis через ticker — используем его.
    ScrollTrigger.create({
      trigger: outer,
      start: 'top bottom',
      end: 'bottom top',
      onEnter:      () => { outer.dataset.visible = 'true' },
      onLeave:      () => { outer.dataset.visible = 'false' },
      onEnterBack:  () => { outer.dataset.visible = 'true' },
      onLeaveBack:  () => { outer.dataset.visible = 'false' },
    })

    // ─── GSAP: фоновый переход cream → #101012 ─────────────────────────────
    //
    // spacer + outer анимируются ВМЕСТЕ как единый блок.
    // Граница между ними невидима → весь вьюпорт темнеет за 1 свайп.
    //
    const row = rowRef.current

    const ctx = gsap.context(() => {
      // GSAP-переход cream→dark только на десктопе.
      if (window.innerWidth > 768) {
        gsap.fromTo(
          [reel, spacer, outer],
          { backgroundColor: '#edebe7' },
          {
            backgroundColor: '#101012',
            ease: 'none',
            scrollTrigger: {
              trigger: reel,
              start: 'top 25%',
              end:   'top 0%',
              scrub: 0.2,
            },
          }
        )
      }

      // ─── Blur: бегущая строка размывается когда карточки проектов
      // скользят поверх неё. Только на десктопе — filter:blur со scrub
      // вызывает repaint каждый кадр и блокирует скролл на mobile.
      if (projectGrid && row && window.innerWidth > 768) {
        gsap.fromTo(
          row,
          { filter: 'blur(0px)' },
          {
            filter: 'blur(16px)',
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: projectGrid,
              start:   'top 90%',
              end:     'top 45%',
              scrub:   0.8,
            },
          }
        )
      }
    })

    return () => {
      clearTimeout(refreshTimer)
      ctx.revert()
      ro.disconnect()
      window.removeEventListener('resize', calibrate)
    }
  }, [])

  const slowDown = useCallback(() => {
    outerRef.current
      ?.querySelectorAll<HTMLElement>(`.${s.animation}`)
      .forEach((el) => { el.style.animationDuration = '90s' })
  }, [])

  const speedUp = useCallback(() => {
    outerRef.current
      ?.querySelectorAll<HTMLElement>(`.${s.animation}`)
      .forEach((el) => { el.style.animationDuration = '38s' })
  }, [])

  return (
    <>
      {/*
        spacer: кремовый блок, заполняющий gap между reel.bottom и outer.top.
        Высота задаётся JS: max(0, vh − reel.offsetHeight).
      */}
      <div ref={spacerRef} className={s.spacer} />

      <div ref={outerRef} className={s.outer} data-visible="false">
        <div
          className={s.inner}
          onMouseEnter={slowDown}
          onMouseLeave={speedUp}
        >
          <div ref={rowRef} className={s.row}>
            <div className={s.animation} style={{ animationName: 'marquee-forward' }}>
              <MarqueeTrack />
            </div>
            <div
              className={s.animation}
              style={{ animationName: 'marquee-forward' }}
              aria-hidden="true"
            >
              <MarqueeTrack />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
