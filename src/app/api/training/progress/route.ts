import { NextResponse } from 'next/server'

import { upsertProgress } from '@/lib/training/clickup'
import { getCurrentTrainingProfile } from '@/lib/training/profile'
import { notifyProgressUpdate } from '@/lib/training/n8n'

/**
 * POST /api/training/progress — persist progress + n8n /webhook/progress-update
 * Body: { courseId, progress, videoId?, watchedVideoIds?, completed? }
 */
export async function POST(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as {
    courseId?: string
    progress?: number
    videoId?: string
    watchedVideoIds?: string[]
    completed?: boolean
  }
  const courseId = body.courseId?.trim()
  if (!courseId) {
    return NextResponse.json({ error: 'courseId required' }, { status: 400 })
  }

  const progress = Math.max(0, Math.min(100, Number(body.progress ?? 0)))
  const completed = Boolean(body.completed) || progress >= 100

  await upsertProgress({
    email: profile.email,
    courseId,
    progressPercent: progress,
    completed,
    watchedVideoIds: body.watchedVideoIds,
  })

  const ts = new Date().toISOString()
  await notifyProgressUpdate({
    user_id: profile.id,
    email: profile.email,
    course_id: courseId,
    progress,
    timestamp: ts,
    completed,
  })

  return NextResponse.json({ ok: true })
}
