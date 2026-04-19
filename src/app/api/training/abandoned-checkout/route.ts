import { NextResponse } from 'next/server'

import { findUserByEmail, TRAINING_CLICKUP_FIELDS as FIELD } from '@/lib/training/clickup'
import { getCurrentTrainingProfile } from '@/lib/training/profile'
import { notifyPaymentAbandoned } from '@/lib/training/n8n'

/**
 * POST /api/training/abandoned-checkout — notify n8n /webhook/payment-abandoned (1h wait in n8n)
 */
export async function POST(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as { courseId?: string }
  const courseId = body.courseId?.trim() || 'drone-fundamentals'
  const ts = new Date().toISOString()

  const record = await findUserByEmail(profile.email)
  const phone = record?.fields[FIELD.phone as keyof typeof record.fields] as string | undefined

  await notifyPaymentAbandoned({
    user_id: profile.id,
    email: profile.email,
    name: profile.name,
    phone,
    course_id: courseId,
    timestamp: ts,
  })

  return NextResponse.json({ ok: true })
}

