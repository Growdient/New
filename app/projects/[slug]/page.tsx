import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProject, getPublishedProjects, getMoreWorkProjects } from '@/lib/data/projects'
import ProjectHero from '@/components/sections/ProjectHero'
import ProjectBody from '@/components/sections/ProjectBody'
import ProjectMoreWork from '@/components/sections/ProjectMoreWork'
import s from './page.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getPublishedProjects().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `https://growdient.com/projects/${project.slug}` },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const moreProjects = getMoreWorkProjects(slug)

  return (
    <main className={s.main}>
      <ProjectHero project={project} />
      <ProjectBody project={project} />
      <ProjectMoreWork projects={moreProjects} />
    </main>
  )
}
