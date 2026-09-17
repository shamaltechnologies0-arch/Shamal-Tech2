import type { Metadata } from 'next'

import { mergeOpenGraph } from '../../utilities/mergeOpenGraph'
import { getServerSideURL } from '../../utilities/getURL'
import { localePath, ogLocale, type Locale } from '../i18n/locale'
import { buildLanguageAlternates } from './alternates'
import { allArabicKeywordsFlat, ARABIC_META_DESCRIPTION, ARABIC_SITE_TITLE } from './arabicKeywords'
import { resolvePageKeywords } from './cmsKeywords'
import {
  allEnglishKeywordsFlat,
  SITE_SEO_DESCRIPTION,
  SITE_SEO_TITLE,
  TARGET_BRAND_KEYWORDS,
} from './englishKeywords'

export const INDEXABLE_ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

export const NOINDEX_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: true,
}

export const GEO_META = {
  'geo.region': 'SA-02',
  'geo.placename': 'Jeddah',
  'geo.position': '21.60244686782873;39.10571367472985',
  ICBM: '21.60244686782873, 39.10571367472985',
}

export function defaultKeywords(locale: Locale): string[] {
  if (locale === 'ar') {
    return [...new Set([...allArabicKeywordsFlat(), ...TARGET_BRAND_KEYWORDS])]
  }
  return [...new Set([...TARGET_BRAND_KEYWORDS, ...allEnglishKeywordsFlat()])]
}

export function defaultTitle(locale: Locale): string {
  return locale === 'ar' ? ARABIC_SITE_TITLE : SITE_SEO_TITLE
}

export function defaultDescription(locale: Locale): string {
  return locale === 'ar' ? ARABIC_META_DESCRIPTION : SITE_SEO_DESCRIPTION
}

type PageSeoInput = {
  locale: Locale
  pathWithoutLocale: string
  title: string
  description: string
  keywords?: string[]
  images?: Array<{ url: string; alt?: string }>
  robots?: Metadata['robots']
}

export async function buildPageMetadata({
  locale,
  pathWithoutLocale,
  title,
  description,
  keywords,
  images,
  robots = INDEXABLE_ROBOTS,
}: PageSeoInput): Promise<Metadata> {
  const isAr = locale === 'ar'
  const canonicalPath = localePath(pathWithoutLocale || '/', locale)
  const siteUrl = getServerSideURL()
  const mergedKeywords = await resolvePageKeywords({
    locale,
    pathWithoutLocale,
    extra: keywords,
  })

  return {
    title,
    description,
    keywords: mergedKeywords,
    robots,
    alternates: buildLanguageAlternates(pathWithoutLocale || '/', locale, siteUrl),
    openGraph: mergeOpenGraph({
      title,
      description,
      locale: ogLocale(locale),
      alternateLocale: isAr ? ['en_SA'] : ['ar_SA'],
      url: canonicalPath,
      images,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@shamaltechnologies',
      site: '@shamaltechnologies',
    },
    other: {
      'content-language': isAr ? 'ar-SA' : 'en-SA',
      'og:locale:alternate': isAr ? 'en_SA' : 'ar_SA',
      'apple-mobile-web-app-title': isAr ? 'شمل للتقنيات' : 'Shamal Technologies',
      'application-name': isAr ? 'شمل للتقنيات' : 'Shamal Technologies',
      ...GEO_META,
    },
  }
}
