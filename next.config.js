import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

// Get server URL with support for AWS Amplify, Vercel, and localhost
function getServerURL() {
  // Priority: NEXT_PUBLIC_SERVER_URL > AWS Amplify > Vercel > localhost
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }

  // AWS Amplify support
  if (process.env.AWS_APP_ID && process.env.AWS_BRANCH) {
    const branch = process.env.AWS_BRANCH === 'main' ? 'main' : process.env.AWS_BRANCH
    return `https://${branch}.${process.env.AWS_APP_ID}.amplifyapp.com`
  }

  // Vercel support (for backward compatibility)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // Fallback
  return process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'
}

const NEXT_PUBLIC_SERVER_URL = getServerURL()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for AWS Amplify SSR support
  // This is required for Payload CMS to work properly in serverless environments
  output: 'standalone',
  images: {
    remotePatterns: [
      // Allow images from the server URL
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        try {
          const url = new URL(item)
          return {
            hostname: url.hostname,
            protocol: url.protocol.replace(':', ''),
          }
        } catch {
          // If URL parsing fails, skip this pattern
          return null
        }
      }).filter(Boolean),
      // S3 bucket image patterns commented out - using local storage only
      // {
      //   protocol: 'https',
      //   hostname: '*.s3.*.amazonaws.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: '*.s3.amazonaws.com',
      // },
      // Also allow direct S3 bucket URLs (bucket.s3.region.amazonaws.com format)
      // ...(process.env.S3_BUCKET ? [{
      //   protocol: 'https',
      //   hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`,
      // }] : []),
    ],
  },
  // Body size limit for server actions - must stay under Lambda's 6MB limit
  // For AWS Amplify SSR (Lambda-based), the hard limit is 6MB
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  typescript: {
    // Disable type checking during build to avoid issues with devDependencies
    // Types are still checked in development and by IDE
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during build to avoid issues with devDependencies
    // ESLint is still run in development
    ignoreDuringBuilds: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
