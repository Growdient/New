import type { Metadata } from 'next'
import { sanityGetPublishedProjects } from '@/lib/sanity/queries'
import Hero from '@/components/sections/Hero'
import StudioIntro from '@/components/sections/StudioIntro'
import ProjectsReel from '@/components/sections/ProjectsReel'
import Marquee from '@/components/sections/Marquee'
import ProjectGrid from '@/components/sections/ProjectGrid'
import ServicesSection from '@/components/sections/ServicesSection'
import StatsSection from '@/components/sections/StatsSection'

export const metadata: Metadata = {
  title: 'Growdient Studio — Brand Identity, UI/UX, Web Development',
  description:
    'Global AI-powered creative lab. Growdient is a design studio turning brand identity design and web development into value. Operating worldwide from Lisbon & Kyiv.',
  alternates: {
    canonical: 'https://growdient.com',
  },
}

export default async function HomePage() {
  const projects = await sanityGetPublishedProjects()

  return (
    <main>
      {/* Hero — cream bg (#edebe7), giant headline bottom-anchored, embedded video */}
      <Hero />

      {/* About/Overlap — cream bg, studio description */}
      <StudioIntro />

      {/* Photo reel — cream bg, infinite horizontal auto-scroll strip */}
      <ProjectsReel />

      {/* Marquee — gradient transition cream → dark, бегущая строка услуг */}
      <Marquee />

      {/* Work — dark bg (#101012), 2-col project grid, hover overlays */}
      <ProjectGrid projects={projects} />

      {/* Services — bg-2 (#e5e3e3), accordion list, hover color change */}
      <ServicesSection />

      {/* Numbers/Stats — dark bg, animated counters */}
      <StatsSection />


    </main>
  )
}
