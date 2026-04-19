import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { COOKIE_NAME } from '@/lib/training/jwt'

/** POST /api/training/auth/logout */
export async function POST() {
  const jar = await cookies()
  jar.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
  return NextResponse.json({ ok: true })
}
