import type { Metadata } from 'next'
import { sanityGetPublishedProjects } from '@/lib/sanity/queries'
import WorkHero from '@/components/sections/WorkHero'
import WorkProjectList from '@/components/sections/WorkProjectList'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected works from branding to digital with strong visual taste. Brand identity, web development, and UI/UX projects by Growdient Studio.',
  alternates: {
    canonical: 'https://growdient.com/projects',
  },
}

export default async function WorkPage() {
  const projects = await sanityGetPublishedProjects()

  return (
    <main>
      {/* ── WORK PAGE ────────────────────────────────────────────────────────────
          Dark section (bg: #101012) that contains:
          1. WorkHero  — sticky 100vh centered headline, animated on load
          2. WorkProjectList — flex-column alternating 50% project cards
          Section is tall enough to provide scrolling space for sticky hero.
      ────────────────────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.container}>
          <WorkHero />
          <WorkProjectList projects={projects} />
        </div>
      </section>
    </main>
  )
}
