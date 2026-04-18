'use client'

/**
 * AnimationsProvider — монтирует IX3 анимации после рендера страницы.
 * Перезапускается при каждом изменении pathname (client-side navigation).
 */

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { setupIX3Animations, destroyIX3Animations } from '@/lib/animations/ix3'

export default function AnimationsProvider() {
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      setupIX3Animations()
    }, 120)

    return () => {
      clearTimeout(timer)
      destroyIX3Animations()
    }
  }, [pathname])

  return null
}
