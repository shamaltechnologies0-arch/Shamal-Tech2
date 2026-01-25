import { NextResponse } from 'next/server'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { sendContactNotification } from '../../../../lib/email'
import { sendLeadResponseEmail, sendLeadNotificationEmail } from '../../../../lib/email/lead-email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, subject, services, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Fetch service details if services are provided
    let serviceDetails: Array<{ title?: string; slug?: string }> = []
    if (services && Array.isArray(services) && services.length > 0) {
      const serviceDocs = await Promise.all(
        services.map(async (serviceId: string) => {
          try {
            const service = await payload.findByID({
              collection: 'services',
              id: serviceId,
              depth: 0,
            })
            return { title: service.title, slug: service.slug }
          } catch {
            return { slug: serviceId }
          }
        })
      )
      serviceDetails = serviceDocs
    }

    // Create contact submission (keep for backward compatibility)
    const submission = await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        subject: subject || undefined,
        services: services && Array.isArray(services) ? services : undefined,
        message,
        status: 'new',
      },
      context: {
        disableRevalidate: true,
      },
    })

    // Create lead in the Leads collection
    let lead
    try {
      lead = await payload.create({
        collection: 'leads',
        data: {
          name,
          email,
          phone: phone || undefined,
          company: company || undefined,
          subject: subject || undefined,
          services: services && Array.isArray(services) ? services : undefined,
          message,
          source: 'contact-form',
          status: 'new',
          priority: 'medium',
        },
        context: {
          disableRevalidate: true,
        },
      })
    } catch (error) {
      console.error('Failed to create lead:', error)
      // Continue even if lead creation fails
    }

    // Send automated response email to the lead
    try {
      await sendLeadResponseEmail({
        leadName: name,
        leadEmail: email,
        companyName: company,
      })
      
      // Mark email as sent in the lead
      if (lead) {
        await payload.update({
          collection: 'leads',
          id: lead.id,
          data: {
            emailSent: true,
            emailSentAt: new Date().toISOString(),
          },
          context: {
            disableRevalidate: true,
          },
        })
      }
    } catch (error) {
      console.error('Failed to send lead response email:', error)
      // Continue even if email fails
    }

    // Send notification email to internal team
    try {
      await sendLeadNotificationEmail({
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        subject: subject || undefined,
        message,
        services: serviceDetails,
      })
    } catch (error) {
      console.error('Failed to send lead notification email:', error)
      // Continue even if email fails
    }

    // Also send the original contact notification (for backward compatibility)
    try {
      await sendContactNotification({
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        subject: subject || undefined,
        message,
      })
    } catch (error) {
      console.error('Failed to send contact notification:', error)
      // Continue even if email fails
    }

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

