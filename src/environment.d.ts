declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      // Email Configuration (Nodemailer)
      SMTP_HOST?: string
      SMTP_PORT?: string
      SMTP_SECURE?: string
      SMTP_USER?: string
      SMTP_PASSWORD?: string
      SMTP_FROM?: string
      SMTP_FROM_NAME?: string
      SMTP_REJECT_UNAUTHORIZED?: string
      // Contact Information
      CONTACT_EMAIL?: string
      CONTACT_PHONE?: string
      // Newsletter
      NEWSLETTER_API_KEY?: string
      NEWSLETTER_AUDIENCE_ID?: string
      NEWSLETTER_PROVIDER?: string
      // Other
      CRON_SECRET?: string
      // AWS S3 Storage - Required for Vercel deployment
      S3_BUCKET?: string
      S3_ACCESS_KEY_ID?: string
      S3_SECRET_ACCESS_KEY?: string
      S3_REGION?: string
      S3_PREFIX?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
