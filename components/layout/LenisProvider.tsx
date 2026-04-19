'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

// iOS Safari < 15.4 не поддерживает индивидуальные CSS transform свойства
// (translate, rotate, scale). force3D заставляет GSAP использовать matrix3d — работает везде.
gsap.config({ force3D: true })

interface LenisContextValue {
  lenis: Lenis | null
}

export const LenisContext = createContext<LenisContextValue>({ lenis: null })
export const useLenis = () => useContext(LenisContext)

interface LenisProviderProps {
  children: React.ReactNode
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      // Mobile: Lenis disabled, use native scroll reset
      window.scrollTo(0, 0)
    }
  }, [pathname])

  useEffect(() => {
    // Touch devices: Lenis intercepts native iOS momentum scroll, causing
    // input lag and freeze. Use native scroll instead.
    // BUT: iOS Safari suspends JS (rAF/ticker) during touch scroll gestures,
    // so GSAP's scrub animations never update mid-swipe.
    // ScrollTrigger.normalizeScroll(true) fixes this by intercepting touch
    // events and driving scroll via GSAP's own rAF ticker — same principle
    // as Lenis on desktop, but lightweight and built into ScrollTrigger.
    if (window.matchMedia('(pointer: coarse)').matches) {
      ScrollTrigger.normalizeScroll(true)
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis
    // Expose globally so components can access Lenis without context timing issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__lenis__ = lenis

    // Connect Lenis scroll → GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Use GSAP ticker to drive Lenis (more reliable than rAF loop)
    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).__lenis__ = undefined
      gsap.ticker.remove(tickerFn)
    }
  }, [])

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  )
}
