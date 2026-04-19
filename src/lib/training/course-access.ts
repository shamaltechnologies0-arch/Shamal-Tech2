/**
 * Role-based course payloads: trial sees previews only; paid gets full embed URLs.
 */

import type { TrainingRole } from './types'
import { TRAINING_COURSES, getCourseById, type TrainingCourse as TC } from './courses'
import { publicEmbedUrl, resolvePaidEmbedUrl } from './vimeo'

export type ClientVideo = {
  id: string
  title: string
  durationMin?: number
  /** Present when the user is allowed to watch */
  embedUrl?: string
  locked?: boolean
}

export type ClientModule = {
  id: string
  title: string
  description?: string
  videos: ClientVideo[]
}

export type CourseClientPayload = {
  course: {
    id: string
    title: string
    description: string
    thumbnail: string
  }
  modules: ClientModule[]
  progressPercent: number
  watchedVideoIds: string[]
}

function pickVimeoIdForPaid(video: { vimeoIdFull?: string; vimeoIdPreview?: string }): string | null {
  return video.vimeoIdFull || video.vimeoIdPreview || null
}

export async function buildCourseClientPayload(
  courseId: string,
  role: TrainingRole,
  watched: Set<string>,
): Promise<CourseClientPayload | null> {
  const course = getCourseById(courseId) as TC | undefined
  if (!course) return null

  const modules: ClientModule[] = []

  for (const mod of course.modules) {
    const videos: ClientVideo[] = []
    for (const v of mod.videos) {
      if (role === 'paid' || role === 'admin') {
        const id = pickVimeoIdForPaid(v)
        if (!id) {
          videos.push({ id: v.id, title: v.title, durationMin: v.durationMin, locked: true })
          continue
        }
        const embedUrl = await resolvePaidEmbedUrl(id)
        videos.push({ id: v.id, title: v.title, durationMin: v.durationMin, embedUrl })
      } else {
        // trial: only videos with explicit preview IDs are playable
        if (v.vimeoIdPreview) {
          videos.push({
            id: v.id,
            title: v.title,
            durationMin: v.durationMin,
            embedUrl: publicEmbedUrl(v.vimeoIdPreview),
          })
        } else {
          videos.push({ id: v.id, title: v.title, durationMin: v.durationMin, locked: true })
        }
      }
    }
    modules.push({
      id: mod.id,
      title: mod.title,
      description: mod.description,
      videos,
    })
  }

  const allIds = course.modules.flatMap((m) => m.videos.map((x) => x.id))
  let done = 0
  for (const id of allIds) {
    if (watched.has(id)) done++
  }
  const progressPercent = allIds.length ? Math.round((done / allIds.length) * 100) : 0

  return {
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
    },
    modules,
    progressPercent,
    watchedVideoIds: [...watched],
  }
}

export function listCourseSummaries(): Pick<TC, 'id' | 'title' | 'description' | 'thumbnail'>[] {
  return TRAINING_COURSES.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    thumbnail: c.thumbnail,
  }))
}
