import type { NewsletterService } from './interface'

export class MailchimpService implements NewsletterService {
  private apiKey: string
  private audienceId: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.NEWSLETTER_API_KEY || ''
    this.audienceId = process.env.NEWSLETTER_AUDIENCE_ID || process.env.NEWSLETTER_LIST_ID || ''
    this.apiUrl =
      process.env.NEWSLETTER_API_URL ||
      `https://${this.apiKey.split('-')[1]}.api.mailchimp.com/3.0`
  }

  async subscribe(email: string): Promise<void> {
    if (!this.apiKey || !this.audienceId) {
      throw new Error('Newsletter service not configured')
    }

    const response = await fetch(
      `${this.apiUrl}/lists/${this.audienceId}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      // If user is already subscribed, that's okay
      if (error.title !== 'Member Exists') {
        throw new Error(error.detail || 'Failed to subscribe to newsletter')
      }
    }
  }

  async unsubscribe(email: string): Promise<void> {
    if (!this.apiKey || !this.audienceId) {
      throw new Error('Newsletter service not configured')
    }

    const emailHash = Buffer.from(email.toLowerCase()).toString('base64')

    await fetch(
      `${this.apiUrl}/lists/${this.audienceId}/members/${emailHash}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          status: 'unsubscribed',
        }),
      }
    )
  }
}

