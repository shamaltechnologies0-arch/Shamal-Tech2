import { NextResponse } from 'next/server'

import { buildCourseClientPayload } from '@/lib/training/course-access'
import { getProgressForCourse } from '@/lib/training/clickup'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

/**
 * GET /api/training/courses/[courseId] — role-aware course payload (no raw private Vimeo ids in JSON for trial).
 */
export async function GET(_req: Request, ctx: { params: Promise<{ courseId: string }> }) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { courseId } = await ctx.params
  const progress = await getProgressForCourse(profile.email, courseId)
  const watched = new Set(progress?.watchedIds || [])

  const payload = await buildCourseClientPayload(courseId, profile.role, watched)
  if (!payload) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  if (progress) {
    payload.progressPercent = progress.progressPercent
  }

  return NextResponse.json(payload)
}
