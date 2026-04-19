/**
 * Static course catalog (MVP). Move to CMS/ClickUp later if needed.
 */

export type TrainingVideo = {
  id: string
  title: string
  /** Public Vimeo video id for trial preview */
  vimeoIdPreview?: string
  /** Private Vimeo id — only resolved server-side for paid users */
  vimeoIdFull?: string
  durationMin?: number
}

export type TrainingModule = {
  id: string
  title: string
  description?: string
  videos: TrainingVideo[]
}

export type TrainingCourse = {
  id: string
  title: string
  description: string
  thumbnail: string
  modules: TrainingModule[]
}

/** Replace placeholder Vimeo IDs with your real public/private ids */
export const TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'drone-fundamentals',
    title: 'Drone Operations Fundamentals',
    description:
      'Enterprise-focused training for safe UAS operations, regulations, and mission planning — built for teams across Saudi Arabia and the Gulf.',
    thumbnail: '/logo-primary.svg',
    modules: [
      {
        id: 'm1',
        title: 'Introduction & Safety',
        description: 'Framework, risk mindset, and pre-flight checks.',
        videos: [
          {
            id: 'v1',
            title: 'Welcome & course map',
            vimeoIdPreview: '76979871',
            vimeoIdFull: '76979871',
            durationMin: 12,
          },
          {
            id: 'v2',
            title: 'Regulatory overview (KSA)',
            vimeoIdPreview: '148751763',
            vimeoIdFull: '148751763',
            durationMin: 18,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Flight Operations',
        description: 'Patterns, weather, and mission execution.',
        videos: [
          {
            id: 'v3',
            title: 'Mission planning workshop',
            vimeoIdFull: '76979871',
            durationMin: 24,
          },
          {
            id: 'v4',
            title: 'Data capture & QA',
            vimeoIdFull: '148751763',
            durationMin: 20,
          },
        ],
      },
    ],
  },
]

export function getCourseById(id: string): TrainingCourse | undefined {
  return TRAINING_COURSES.find((c) => c.id === id)
}

export function courseCompletionPercent(course: TrainingCourse, watchedVideoIds: Set<string>): number {
  const all = course.modules.flatMap((m) => m.videos)
  if (all.length === 0) return 0
  let count = 0
  for (const v of all) {
    if (watchedVideoIds.has(v.id)) count++
  }
  return Math.round((count / all.length) * 100)
}
