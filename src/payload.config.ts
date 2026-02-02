
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Career } from './collections/Career'
import { ChatSummaries } from './collections/ChatSummaries'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { IssueReports } from './collections/IssueReports'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { NewsletterSubscriptions } from './collections/NewsletterSubscriptions'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { SEOKeywords } from './collections/SEOKeywords'
import { Services } from './collections/Services'
import { Users } from './collections/Users'

import { AboutPageContent } from './globals/AboutPageContent'
import { CareersPageContent } from './globals/CareersPageContent'
import { ContactPageContent } from './globals/ContactPageContent'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { HomepageContent } from './globals/HomepageContent'
import { PostsPageContent } from './globals/PostsPageContent'
import { ProductsPageContent } from './globals/ProductsPageContent'
import { SEOSettings } from './globals/SEOSettings'
import { SectorsContent } from './globals/SectorsContent'
import { ServicesPageContent } from './globals/ServicesPageContent'
import { SiteSettings } from './globals/SiteSettings'

import { plugins } from './plugins'
import { defaultLexical } from './fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* ---------------- EMAIL CONFIG ---------------- */
// Configure email adapter for Outlook SMTP
const emailAdapter =
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD
    ? nodemailerAdapter({
        defaultFromAddress:
          process.env.SMTP_FROM || process.env.SMTP_USER,
        defaultFromName:
          process.env.SMTP_FROM_NAME || 'Shamal Technologies',
        skipVerify: process.env.NODE_ENV === 'development', // Skip verification in development for faster startup
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true', // false for port 587 (STARTTLS), true for port 465 (SSL)
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
          tls: {
            rejectUnauthorized:
              process.env.SMTP_REJECT_UNAUTHORIZED !== 'false',
            ciphers: 'TLSv1.2', // Outlook/Office 365 compatible cipher
          },
          requireTLS: true, // Office 365 requires TLS
        },
      })
    : undefined

/* ---------------- PAYLOAD CONFIG ---------------- */

export default buildConfig({
  /** 🔑 REQUIRED FOR PROD ADMIN */
  serverURL: getServerSideURL(),

  // Body parser limits - must stay under Lambda's 6MB request body limit
  // For AWS Amplify SSR (Lambda-based), the hard limit is 6MB
  bodyParser: {
    json: {
      limit: '5mb',
    },
    urlencoded: {
      limit: '5mb',
      extended: true,
    },
  },

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // ❌ Removed custom admin components to prevent broken importMap generation
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) => {
        const baseURL = getServerSideURL()
  
        if (collectionConfig?.slug === 'pages') {
          const slug =
            typeof data?.slug === 'string' ? data.slug : 'home'
          return `${baseURL}/${slug === 'home' ? '' : slug}`
        }
  
        if (collectionConfig?.slug === 'posts') {
          return `${baseURL}/posts/${data?.slug ?? ''}`
        }
  
        if (collectionConfig?.slug === 'services') {
          return `${baseURL}/services/${data?.slug ?? ''}`
        }
  
        if (collectionConfig?.slug === 'career') {
          return `${baseURL}/careers/${data?.slug ?? ''}`
        }
  
        if (globalConfig?.slug === 'homepage-content') return baseURL
        if (globalConfig?.slug === 'about-page-content') return `${baseURL}/about`
        if (globalConfig?.slug === 'posts-page-content') return `${baseURL}/posts`
        if (globalConfig?.slug === 'careers-page-content') return `${baseURL}/careers`
        if (globalConfig?.slug === 'contact-page-content') return `${baseURL}/contact`
        if (globalConfig?.slug === 'products-page-content') return `${baseURL}/products`
        if (globalConfig?.slug === 'services-page-content') return `${baseURL}/services`
  
        return baseURL
      },
    },
  },
  

  editor: defaultLexical,

  email: emailAdapter,

  /** ✅ FIXED MONGODB CONFIG */
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),

  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Services,
    Products,
    Career,
    ContactSubmissions,
    Leads,
    NewsletterSubscriptions,
    SEOKeywords,
    IssueReports,
    ChatSummaries,
  ],

  // CORS configuration - allow frontend requests from the server URL and localhost
  cors: (() => {
    const origins: string[] = []
    const serverURL = getServerSideURL()
    
    // Add the server URL (handles NEXT_PUBLIC_SERVER_URL, Vercel, AWS Amplify, or localhost)
    if (serverURL) {
      origins.push(serverURL)
    }
    
    // Add specific Vercel domain if different from serverURL
    if (process.env.VERCEL_URL) {
      const vercelURL = `https://${process.env.VERCEL_URL}`
      if (!origins.includes(vercelURL)) {
        origins.push(vercelURL)
      }
    }
    
    // Add Vercel production URL if available
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      const prodURL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      if (!origins.includes(prodURL)) {
        origins.push(prodURL)
      }
    }
    
    // Note: Payload doesn't support wildcard patterns in CORS/CSRF
    // Each specific domain must be added explicitly via NEXT_PUBLIC_SERVER_URL
    
    // Add localhost for development
    if (process.env.NODE_ENV === 'development') {
      origins.push('http://localhost:3000')
    }
    
    return origins
  })(),

  // CSRF configuration - same as CORS for consistency
  csrf: (() => {
    const origins: string[] = []
    const serverURL = getServerSideURL()
    
    // Add the server URL (handles NEXT_PUBLIC_SERVER_URL, Vercel, AWS Amplify, or localhost)
    if (serverURL) {
      origins.push(serverURL)
    }
    
    // Add specific Vercel domain if different from serverURL
    if (process.env.VERCEL_URL) {
      const vercelURL = `https://${process.env.VERCEL_URL}`
      if (!origins.includes(vercelURL)) {
        origins.push(vercelURL)
      }
    }
    
    // Add Vercel production URL if available
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      const prodURL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      if (!origins.includes(prodURL)) {
        origins.push(prodURL)
      }
    }
    
    // Note: Payload doesn't support wildcard patterns in CORS/CSRF
    // Each specific domain must be added explicitly via NEXT_PUBLIC_SERVER_URL
    
    // Add localhost for development
    if (process.env.NODE_ENV === 'development') {
      origins.push('http://localhost:3000')
    }
    
    return origins
  })(),

  globals: [
    Header,
    Footer,
    SiteSettings,
    HomepageContent,
    AboutPageContent,
    PostsPageContent,
    CareersPageContent,
    ContactPageContent,
    ProductsPageContent,
    ServicesPageContent,
    SectorsContent,
    SEOSettings,
  ],

  plugins,

  secret: process.env.PAYLOAD_SECRET,

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }) => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
