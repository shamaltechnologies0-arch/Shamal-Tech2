import { getServerSideURL } from '../../utilities/getURL'
import { localePath, parseLocalePath } from '../i18n/locale'

import type { SitemapEntry } from './sitemapLocales'

function originOf(siteUrl: string): string {
  return siteUrl.replace(/\/$/, '')
}

export function hreflangForLoc(loc: string, siteUrl = getServerSideURL()) {
  const origin = originOf(siteUrl)
  if (!loc.startsWith(origin)) {
    return {
      'x-default': loc,
    }
  }
  const path = loc.slice(origin.length) || '/'
  const { pathname } = parseLocalePath(path)
  const enUrl = `${origin}${localePath(pathname, 'en')}`
  const arUrl = `${origin}${localePath(pathname, 'ar')}`
  return {
    'en-SA': enUrl,
    'ar-SA': arUrl,
    'x-default': enUrl,
  }
}

export function withSitemapHreflang<T extends SitemapEntry>(entry: T, siteUrl = getServerSideURL()): T & {
  alternates: { languages: Record<string, string> }
} {
  return {
    ...entry,
    alternates: {
      languages: hreflangForLoc(entry.loc, siteUrl),
    },
  }
}

export function renderSitemapUrlSet(entries: Array<SitemapEntry & { alternates?: { languages?: Record<string, string> } }>): string {
  const urls = entries
    .map((entry) => {
      const languages = entry.alternates?.languages || hreflangForLoc(entry.loc)
      const links = Object.entries(languages)
        .map(
          ([lang, href]) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`,
        )
        .join('\n')

      return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    ${entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${escapeXml(entry.changefreq)}</changefreq>` : ''}
    ${typeof entry.priority === 'number' ? `<priority>${entry.priority}</priority>` : ''}
${links}
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`
}

export function renderSitemapIndex(locs: string[]): string {
  const body = locs
    .map(
      (loc) => `  <sitemap>
    <loc>${escapeXml(loc)}</loc>
  </sitemap>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
