export interface NewsletterService {
  subscribe(email: string): Promise<void>
  unsubscribe(email: string): Promise<void>
}

