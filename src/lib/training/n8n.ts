/**
 * Outbound n8n webhook calls (signup, payment, progress, lead, abandoned checkout).
 */

import { getN8nWebhookBaseUrl } from './env'
import type { N8nWebhookPayload } from './types'

/** Override paths to match your n8n workflow (defaults align with the MVP spec). */
function pathFor(
  key:
    | 'newUser'
    | 'paymentSuccess'
    | 'progress'
    | 'lead'
    | 'paymentAbandoned',
): string {
  const envMap: Record<string, string | undefined> = {
    newUser: process.env.N8N_PATH_NEW_USER,
    paymentSuccess: process.env.N8N_PATH_PAYMENT_SUCCESS,
    progress: process.env.N8N_PATH_PROGRESS,
    lead: process.env.N8N_PATH_LEAD,
    paymentAbandoned: process.env.N8N_PATH_PAYMENT_ABANDONED,
  }
  const defaults: Record<typeof key, string> = {
    newUser: '/webhook/new-user',
    paymentSuccess: '/webhook/payment-success',
    progress: '/webhook/progress-update',
    lead: '/webhook/lead-captured',
    paymentAbandoned: '/webhook/payment-abandoned',
  }
  return envMap[key] || defaults[key]
}

async function post(path: string, body: Record<string, unknown>) {
  const base = getN8nWebhookBaseUrl()
  if (!base) return
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    // Non-blocking: automation failures must not break core flows
  }
}

/** POST → configured path (default /webhook/new-user; use N8N_PATH_NEW_USER=/webhook/user-signup for bundled workflow) */
export function notifyNewUser(payload: {
  user_id: string
  email: string
  name: string
  phone?: string
  timestamp: string
}) {
  return post(pathFor('newUser'), payload)
}

/** POST /webhook/payment-success */
export function notifyPaymentSuccess(payload: N8nWebhookPayload & { amount?: number; currency?: string }) {
  return post(pathFor('paymentSuccess'), payload)
}

/** POST /webhook/progress-update */
export function notifyProgressUpdate(payload: N8nWebhookPayload) {
  return post(pathFor('progress'), payload)
}

/** POST /webhook/lead-captured (or /webhook/lead-activity) */
export function notifyLeadCaptured(payload: N8nWebhookPayload & { action?: string }) {
  return post(pathFor('lead'), payload)
}

/** POST /webhook/payment-abandoned (n8n waits 1h then reminds) */
export function notifyPaymentAbandoned(payload: {
  user_id: string
  email: string
  name: string
  phone?: string
  course_id: string
  timestamp: string
}) {
  return post(pathFor('paymentAbandoned'), payload)
}
