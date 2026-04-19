import { NextResponse } from 'next/server'

import { getCurrentTrainingProfile } from '@/lib/training/profile'

/** GET /api/training/auth/me — ClickUp-backed profile (role reflects payments). */
export async function GET() {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({
    user: profile,
  })
}
