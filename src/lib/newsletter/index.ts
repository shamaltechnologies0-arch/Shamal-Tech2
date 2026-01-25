import { MailchimpService } from './mailchimp'
import type { NewsletterService } from './interface'

let newsletterService: NewsletterService | null = null

function getNewsletterService(): NewsletterService {
  if (newsletterService) {
    return newsletterService
  }

  const provider = process.env.NEWSLETTER_PROVIDER || 'mailchimp'

  switch (provider) {
    case 'mailchimp':
      newsletterService = new MailchimpService()
      break
    default:
      throw new Error(`Unsupported newsletter provider: ${provider}`)
  }

  return newsletterService
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  const service = getNewsletterService()
  await service.subscribe(email)
}

export async function unsubscribeFromNewsletter(email: string): Promise<void> {
  const service = getNewsletterService()
  await service.unsubscribe(email)
}

