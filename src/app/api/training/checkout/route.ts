import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { getStripeKeys, getTrainingPriceCourseId } from '@/lib/training/env'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

/**
 * POST /api/training/checkout — Stripe Checkout Session (redirect URL returned).
 * Requires STRIPE_SECRET_KEY and STRIPE_PRICE_ID.
 */
export async function POST(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (profile.role === 'paid' || profile.role === 'admin') {
    return NextResponse.json({ error: 'Already unlocked' }, { status: 400 })
  }

  const { secretKey } = getStripeKeys()
  const priceId = process.env.STRIPE_PRICE_ID
  if (!secretKey || !priceId) {
    return NextResponse.json({ error: 'Stripe is not configured (STRIPE_SECRET_KEY, STRIPE_PRICE_ID)' }, { status: 503 })
  }

  const body = (await req.json().catch(() => ({}))) as { courseId?: string }
  const courseId = body.courseId?.trim() || getTrainingPriceCourseId()

  const base =
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') ||
    (typeof process.env.VERCEL_URL === 'string' ? `https://${process.env.VERCEL_URL}` : 'https://localhost:3000')

  const stripe = new Stripe(secretKey, {
    apiVersion: '2026-03-25.dahlia',
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/training/dashboard?checkout=success`,
    cancel_url: `${base}/training/checkout?cancelled=1&course=${encodeURIComponent(courseId)}`,
    metadata: {
      training_user_id: profile.id,
      training_email: profile.email,
      training_course_id: courseId,
    },
    customer_email: profile.email,
  })

  if (!session.url) {
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}
