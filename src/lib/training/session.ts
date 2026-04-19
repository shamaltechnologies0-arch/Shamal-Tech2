import { cookies } from 'next/headers'

import { COOKIE_NAME, verifyTrainingToken } from './jwt'
import type { TrainingJwtPayload } from './types'

export async function getTrainingSession(): Promise<TrainingJwtPayload | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyTrainingToken(token)
}
