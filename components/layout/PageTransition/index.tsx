'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import s from './index.module.css'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      overlay.style.transform = 'scaleY(0)'
      return
    }

    if (isFirstRender.current) {
      isFirstRender.current = false

      const gsapModule = import('gsap').then(({ gsap }) => {
        // Initial load: curtain reveals page from top
        gsap.set(overlay, { scaleY: 1, transformOrigin: 'top' })
        gsap.to(overlay, {
          scaleY: 0,
          duration: 0.9,
          ease: 'expo.inOut',
          delay: 0.05,
          onComplete: () => {
            overlay.style.pointerEvents = 'none'
          },
        })
      })
      return () => { void gsapModule }
    }

    // ─── Route change: cover → reveal ────────────────────────────────────────
    overlay.style.pointerEvents = 'all'
    overlay.style.transformOrigin = 'bottom'
    overlay.style.transform = 'scaleY(1)'

    // pointer-events:all blocks clicks but NOT wheel/touch scroll.
    // Users can scroll while the overlay covers the page, advancing the
    // ScrollTrigger scrub before the page is visible — causing the first
    // 1-2 swipes to show the animation at wrong progress.
    // Fix: block wheel + touch scroll for the duration of the transition.
    const preventScroll = (e: Event) => { e.preventDefault() }
    document.addEventListener('wheel', preventScroll, { passive: false })
    document.addEventListener('touchmove', preventScroll, { passive: false })

    const unlockScroll = () => {
      document.removeEventListener('wheel', preventScroll)
      document.removeEventListener('touchmove', preventScroll)
    }

    let cleanup: (() => void) | undefined
    const gsapModule = import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({
        onComplete: () => {
          overlay.style.pointerEvents = 'none'
          unlockScroll()
          // Refresh all ScrollTriggers now that overlay is gone and scroll=0
          import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh()
          })
        },
      })

      tl.set(overlay, { transformOrigin: 'top' })
      tl.to(overlay, {
        scaleY: 0,
        duration: 0.7,
        ease: 'expo.inOut',
      })

      cleanup = () => {
        tl.kill()
        unlockScroll()
      }
    })

    return () => {
      void gsapModule
      cleanup?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      <div
        ref={overlayRef}
        className={s.overlay}
        aria-hidden="true"
        aria-live="polite"
        style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
      />
      {children}
    </>
  )
}
