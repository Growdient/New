import type { Metadata } from 'next'
import AboutHero from '@/components/sections/AboutHero'
import AboutTeam from '@/components/sections/AboutTeam'

export const metadata: Metadata = {
  title: 'About — Growdient Studio',
  description:
    'Global AI-powered creative lab. We build standout brands, lightning-fast websites, and scalable design systems for brands who value clarity and measurable impact.',
  alternates: { canonical: 'https://growdient.com/about' },
}

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutTeam />
    </main>
  )
}
