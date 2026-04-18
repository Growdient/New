'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import ConditionalFooter from './ConditionalFooter'
import PageTransition from './PageTransition'
import AnimationsProvider from './AnimationsProvider'
import CustomCursor from '@/components/effects/CustomCursor'
import GrainOverlay from '@/components/effects/GrainOverlay'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <>
      <AnimationsProvider />
      <GrainOverlay />
      <CustomCursor />
      <Navbar />
      <PageTransition>
        {children}
        <ConditionalFooter />
      </PageTransition>
    </>
  )
}
