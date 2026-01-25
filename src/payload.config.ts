
import { mongooseAdapter } from '@payloadcms/db-mongodb'
// import { nodemailerAdapter } from '@payloadcms/email-nodemailer' // Commented out - SMTP disabled
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
import { Portfolio } from './collections/Portfolio'
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
// SMTP configuration commented out - will be enabled when proper SMTP variables are provided
// TODO: Uncomment and configure when SMTP credentials are ready

// const emailAdapter =
//   process.env.SMTP_HOST &&
//   process.env.SMTP_USER &&
//   process.env.SMTP_PASSWORD
//     ? nodemailerAdapter({
//         defaultFromAddress:
//           process.env.SMTP_FROM || process.env.SMTP_USER,
//         defaultFromName:
//           process.env.SMTP_FROM_NAME || 'Shamal Technologies',
//         transportOptions: {
//           host: process.env.SMTP_HOST,
//           port: Number(process.env.SMTP_PORT || 587),
//           secure: process.env.SMTP_SECURE === 'true',
//           auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASSWORD,
//           },
//           tls: {
//             rejectUnauthorized:
//               process.env.SMTP_REJECT_UNAUTHORIZED !== 'false',
//           },
//         },
//       })
//     : undefined

const emailAdapter = undefined // Disabled until SMTP is properly configured

/* ---------------- PAYLOAD CONFIG ---------------- */

export default buildConfig({
  /** 🔑 REQUIRED FOR PROD ADMIN */
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,

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
  
        if (collectionConfig?.slug === 'portfolio') {
          return `${baseURL}/portfolio/${data?.slug ?? ''}`
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
    Portfolio,
    Career,
    ContactSubmissions,
    Leads,
    NewsletterSubscriptions,
    SEOKeywords,
    IssueReports,
    ChatSummaries,
  ],

  cors: [
    getServerSideURL(),
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : null,
  ].filter(Boolean) as string[],

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
