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

    // Route change: cover → reveal
    overlay.style.pointerEvents = 'all'
    overlay.style.transformOrigin = 'bottom'
    overlay.style.transform = 'scaleY(1)'

    let cleanup: (() => void) | undefined
    const gsapModule = import('gsap').then(({ gsap }) => {
      // After covering, flip origin and reveal
      const tl = gsap.timeline({
        onComplete: () => {
          overlay.style.pointerEvents = 'none'
        },
      })

      tl.set(overlay, { transformOrigin: 'top' })
      tl.to(overlay, {
        scaleY: 0,
        duration: 0.7,
        ease: 'expo.inOut',
      })

      cleanup = () => tl.kill()
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
