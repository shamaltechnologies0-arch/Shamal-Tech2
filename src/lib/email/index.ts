// Email service utility
// Uses Payload CMS email plugin (@payloadcms/email-nodemailer)

import type { Payload } from 'payload'
import configPromise from '../../payload.config'
import { getPayload } from 'payload'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
}

let payloadInstance: Payload | null = null

async function getPayloadInstance(): Promise<Payload> {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config: configPromise })
  }
  return payloadInstance
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const payload = await getPayloadInstance()
  
  // Use Payload's email API
  await payload.sendEmail({
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    from: options.from,
    replyTo: options.replyTo,
    cc: options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
    bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
  })
}

export async function sendContactNotification(submission: {
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
}): Promise<void> {
  const contactEmail = process.env.CONTACT_EMAIL || 'hello@shamal.sa'

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${submission.name}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    ${submission.phone ? `<p><strong>Phone:</strong> ${submission.phone}</p>` : ''}
    ${submission.company ? `<p><strong>Company:</strong> ${submission.company}</p>` : ''}
    ${submission.subject ? `<p><strong>Subject:</strong> ${submission.subject}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${submission.message}</p>
  `

  await sendEmail({
    to: contactEmail,
    subject: `New Contact Form Submission from ${submission.name}`,
    html,
    text: `New contact form submission from ${submission.name} (${submission.email})`,
  })
}

export async function sendNewsletterNotification(email: string, source?: string): Promise<void> {
  const contactEmail = process.env.CONTACT_EMAIL || 'hello@shamal.sa'

  const html = `
    <h2>New Newsletter Subscription</h2>
    <p><strong>Email:</strong> ${email}</p>
    ${source ? `<p><strong>Source:</strong> ${source}</p>` : ''}
    <p><strong>Subscribed At:</strong> ${new Date().toLocaleString()}</p>
  `

  await sendEmail({
    to: contactEmail,
    subject: `New Newsletter Subscription: ${email}`,
    html,
    text: `New newsletter subscription from ${email}${source ? ` (Source: ${source})` : ''}`,
  })
}
