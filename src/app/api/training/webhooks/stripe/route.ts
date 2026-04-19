import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import {
  createPaymentRecord,
  TRAINING_CLICKUP_FIELDS as FIELD,
  updateUser,
} from '@/lib/training/clickup'
import { getStripeKeys } from '@/lib/training/env'
import { notifyPaymentSuccess } from '@/lib/training/n8n'

export const dynamic = 'force-dynamic'

/**
 * POST /api/training/webhooks/stripe — Stripe webhook: upgrade user + payment row + n8n payment-success.
 */
export async function POST(req: Request) {
  const { secretKey, webhookSecret } = getStripeKeys()
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 503 })
  }

  const raw = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const userId = session.metadata?.training_user_id
  const email = session.metadata?.training_email || session.customer_details?.email || session.customer_email
  const courseId = session.metadata?.training_course_id || 'drone-fundamentals'

  if (!userId || !email) {
    return NextResponse.json({ received: true, skipped: true })
  }

  const amount = (session.amount_total ?? 0) / 100
  const currency = (session.currency || 'sar').toUpperCase()

  try {
    await updateUser(userId, {
      [FIELD.role]: 'paid',
    })
    await createPaymentRecord({
      email,
      amount,
      currency,
      stripeSessionId: session.id,
    })
    await notifyPaymentSuccess({
      user_id: userId,
      email,
      course_id: courseId,
      progress: 0,
      timestamp: new Date().toISOString(),
      amount,
      currency,
    })
  } catch (e) {
    console.error('Stripe webhook handler error', e)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
