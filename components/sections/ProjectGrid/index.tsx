'use client'

import { useRef } from 'react'
import Link from 'next/link'
import ProjectCard from '@/components/ui/ProjectCard'
import type { Project } from '@/lib/data/types'
import s from './ProjectGrid.module.css'

// Webflow IX3 button attributes — not standard HTML, cast required
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ix3 = (attrs: Record<string, string>) => attrs as any

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className={s.section} data-section="project-grid">
      <div className={s.container}>
        <div className={s.header}>
          <span className={`label-small ${s.label}`}>Selected works</span>
        </div>

        <div className={s.grid}>
          {projects.map((project, i) => (
            <div key={project.id} data-card className={s.cell}>
              <ProjectCard
                project={project}
                index={i}
                priority={i < 2}
              />
            </div>
          ))}
        </div>

        {/* All projects CTA — Instrument Serif 40px text link с underline */}
        <div className={s.allProjectsWrap}>
          <Link href="/projects" className={s.allProjectsLink}>
            All projects
          </Link>
        </div>
      </div>
    </section>
  )
}
