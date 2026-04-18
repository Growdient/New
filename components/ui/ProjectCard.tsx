import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/lib/data/types'
import s from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  index?: number
  priority?: boolean
}

export default function ProjectCard({
  project,
  index,
  priority = false,
}: ProjectCardProps) {
  const thumbnail = project.thumbnail?.url
  const primaryService = project.services ?? project.tags[0]

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={s.card}
      aria-label={`View project: ${project.name}`}
    >
      {/* IMAGE — сверху, без текста поверх */}
      <div className={s.imageWrap}>
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={project.thumbnail?.alt ?? project.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className={s.image}
            priority={priority}
          />
        ) : (
          <div className={s.imagePlaceholder} />
        )}

        {/* Overlay только при hover для визуальной отдачи */}
        <div className={s.overlay} aria-hidden="true" />
      </div>

      {/* CONTENT — под изображением */}
      <div className={s.content}>
        <h3 className={s.title}>{project.name}</h3>
        {primaryService && (
          <span className={s.service}>{primaryService}</span>
        )}
      </div>
    </Link>
  )
}
