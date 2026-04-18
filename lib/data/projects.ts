import projectsData from '@/data/projects.json'
import type { Project } from './types'

export function getProjects(): Project[] {
  return (projectsData as Project[]).sort((a, b) => a.order - b.order)
}

export function getPublishedProjects(): Project[] {
  return getProjects().filter((p) => !p.isDraft)
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null
  next: Project | null
} {
  const published = getPublishedProjects()
  const idx = published.findIndex((p) => p.slug === slug)
  return {
    prev: idx > 0 ? published[idx - 1] : null,
    next: idx < published.length - 1 ? published[idx + 1] : null,
  }
}

export function getMoreWorkProjects(slug: string): [Project, Project] | [Project] | [] {
  const published = getPublishedProjects()
  const idx = published.findIndex((p) => p.slug === slug)
  if (published.length < 2) return []
  const others = published.filter((_, i) => i !== idx)
  // Take next 2 from the list, cycling if needed
  const a = others[idx % others.length]
  const b = others[(idx + 1) % others.length]
  if (a === b) return [a]
  return [a, b]
}
