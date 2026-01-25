import { NextResponse } from 'next/server'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { subscribeToNewsletter } from '../../../../lib/newsletter'
import { sendNewsletterNotification } from '../../../../lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, source } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Check if email already exists
    const existing = await payload.find({
      collection: 'newsletter-subscriptions',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'Email is already subscribed' },
        { status: 400 }
      )
    }

    // Subscribe to external newsletter service (optional)
    try {
      await subscribeToNewsletter(email)
    } catch (error) {
      console.error('Newsletter service error:', error)
      // Continue to save in PayloadCMS even if external service fails
    }

    // Save to PayloadCMS - This is the primary record
    const subscription = await payload.create({
      collection: 'newsletter-subscriptions',
      data: {
        email,
        status: 'active',
        source: source || 'website',
      },
      context: {
        disableRevalidate: true,
      },
    })

    // Send instant email notification to hello@shamal.sa
    // Only send after successful CMS save to ensure record exists
    try {
      await sendNewsletterNotification(email, source || 'website')
    } catch (error) {
      // Log error but don't fail the subscription since CMS record is already saved
      console.error('Failed to send newsletter notification email:', error)
    }

    // Return success with subscription ID for reference
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        id: subscription.id,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

