import type { MetadataRoute } from 'next'

import { getServerSideURL } from '../../utilities/getURL'

function absoluteUrl(path: string, siteUrl: string): string {
  const origin = siteUrl.replace(/\/$/, '')
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getServerSideURL()
  const host = (() => {
    try {
      return new URL(siteUrl).host
    } catch {
      return 'shamal.sa'
    }
  })()

  const sitemaps = [
    '/sitemap.xml',
    '/pages-sitemap.xml',
    '/posts-sitemap.xml',
    '/services-sitemap.xml',
    '/products-sitemap.xml',
    '/employees-sitemap.xml',
  ].map((path) => absoluteUrl(path, siteUrl))

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/next/', '/products/quote', '/training/dashboard', '/training/admin'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/next/'],
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/next/'],
      },
      {
        userAgent: 'msnbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/next/'],
      },
    ],
    sitemap: sitemaps,
    host,
  }
}
