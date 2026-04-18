'use client'

/**
 * useIX3 — инициализирует анимации IX3 после монтирования компонента.
 *
 * Использование в page.tsx:
 *   import { useIX3 } from '@/lib/hooks/useIX3'
 *   export default function HomePage() {
 *     useIX3()
 *     return <main>...</main>
 *   }
 */

import { useEffect } from 'react'
import { setupIX3Animations, destroyIX3Animations } from '@/lib/animations/ix3'

export function useIX3() {
  useEffect(() => {
    // Небольшой delay чтобы DOM полностью отрисовался (Next.js SSR hydration)
    const timer = setTimeout(() => {
      setupIX3Animations()
    }, 50)

    return () => {
      clearTimeout(timer)
      destroyIX3Animations()
    }
  }, [])
}
