import { NextResponse } from 'next/server'

import { listCourseSummaries } from '@/lib/training/course-access'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

/** GET /api/training/courses — catalog summaries for logged-in users */
export async function GET() {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ courses: listCourseSummaries() })
}
