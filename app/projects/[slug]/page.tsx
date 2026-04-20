import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityGetProject, sanityGetPublishedProjects, sanityGetMoreWorkProjects } from '@/lib/sanity/queries'
import ProjectHero from '@/components/sections/ProjectHero'
import ProjectBody from '@/components/sections/ProjectBody'
import ProjectMoreWork from '@/components/sections/ProjectMoreWork'
import s from './page.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await sanityGetPublishedProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await sanityGetProject(slug)
  if (!project) return {}
  const ogImg = project.ogImage?.url ?? project.thumbnail?.url
  return {
    title: project.metaTitle ?? project.name,
    description: project.metaDescription ?? project.description,
    alternates: { canonical: `https://growdient.com/projects/${project.slug}` },
    openGraph: {
      title: project.ogTitle ?? project.metaTitle ?? project.name,
      description: project.ogDescription ?? project.metaDescription ?? project.description,
      ...(ogImg && { images: [{ url: ogImg, width: 1200, height: 630 }] }),
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [project, moreProjects] = await Promise.all([
    sanityGetProject(slug),
    sanityGetMoreWorkProjects(slug),
  ])
  if (!project) notFound()

  return (
    <main className={s.main}>
      <ProjectHero project={project} />
      <ProjectBody project={project} />
      <ProjectMoreWork projects={moreProjects} />
    </main>
  )
}
