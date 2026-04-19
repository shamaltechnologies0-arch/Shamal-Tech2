/**
 * Training platform shared types (JWT payload, roles, API shapes).
 */

export type TrainingRole = 'trial' | 'paid' | 'admin'

export type TrainingJwtPayload = {
  /** ClickUp task id */
  sub: string
  email: string
  name: string
  role: TrainingRole
  iat?: number
  exp?: number
}

export type N8nWebhookPayload = {
  user_id: string
  email: string
  course_id?: string
  progress?: number
  timestamp: string
  name?: string
  phone?: string
  completed?: boolean
  action?: string
}
