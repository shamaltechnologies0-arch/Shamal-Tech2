import type { Metadata } from 'next'

import { getCachedGlobal } from '../../utilities/getGlobals'
import { getServerSideURL } from '../../utilities/getURL'
import { getRequestInternalPathname, getRequestLocale } from '../i18n/getRequestLocale'
import { htmlLang } from '../i18n/locale'
import {
  allArabicKeywordsFlat,
  ARABIC_META_DESCRIPTION,
  ARABIC_SITE_TITLE,
} from './arabicKeywords'
import {
  allEnglishKeywordsFlat,
  SITE_SEO_DESCRIPTION,
  SITE_SEO_TITLE,
  TARGET_BRAND_KEYWORDS,
} from './englishKeywords'
import { buildPageMetadata, GEO_META } from './pageMetadata'

type SeoSettingsDoc = {
  primaryKeywords?: string[] | null
  secondaryKeywords?: string[] | null
  longTailKeywords?: string[] | null
  arabicPrimaryKeywords?: string[] | null
  arabicSecondaryKeywords?: string[] | null
  arabicLongTailKeywords?: string[] | null
  metaDescriptionTemplateAr?: string | null
}

export async function getSiteSeoMetadata(): Promise<Metadata> {
  let settings: SeoSettingsDoc | null = null

  try {
    settings = (await getCachedGlobal('seo-settings', 0)()) as SeoSettingsDoc
  } catch {
    settings = null
  }

  const locale = await getRequestLocale()
  const path = await getRequestInternalPathname()
  const isAr = locale === 'ar'

  const englishFromCms = [
    ...(settings?.primaryKeywords || []),
    ...(settings?.secondaryKeywords || []).slice(0, 12),
    ...(settings?.longTailKeywords || []).slice(0, 8),
  ]
  const englishKeywords = englishFromCms.length > 0 ? englishFromCms : allEnglishKeywordsFlat()

  const arabicFromCms = [
    ...(settings?.arabicPrimaryKeywords || []),
    ...(settings?.arabicSecondaryKeywords || []).slice(0, 12),
    ...(settings?.arabicLongTailKeywords || []).slice(0, 8),
  ]
  const arabicKeywords = arabicFromCms.length > 0 ? arabicFromCms : allArabicKeywordsFlat()

  const title = isAr ? ARABIC_SITE_TITLE : SITE_SEO_TITLE
  const description = isAr
    ? settings?.metaDescriptionTemplateAr || ARABIC_META_DESCRIPTION
    : SITE_SEO_DESCRIPTION
  const keywords = isAr
    ? [...new Set([...arabicKeywords, ...TARGET_BRAND_KEYWORDS])]
    : [...new Set([...TARGET_BRAND_KEYWORDS, ...englishKeywords])]

  const page = buildPageMetadata({
    locale,
    pathWithoutLocale: path,
    title,
    description,
    keywords,
  })

  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      default: title,
      template: isAr ? '%s | شمل للتقنيات' : '%s | Shamal Technologies',
    },
    description: page.description,
    keywords: page.keywords,
    robots: page.robots,
    alternates: page.alternates,
    openGraph: page.openGraph,
    twitter: page.twitter,
    other: {
      ...GEO_META,
      'content-language': htmlLang(locale),
      'og:locale:alternate': isAr ? 'en_SA' : 'ar_SA',
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon-32.png',
      apple: '/apple-touch-icon.png',
    },
  }
}

/** Arabic-only metadata fields for pages that support bilingual SEO. */
export function getArabicPageSeoFields(settings?: SeoSettingsDoc | null) {
  return {
    titleAr: ARABIC_SITE_TITLE,
    descriptionAr: settings?.metaDescriptionTemplateAr || ARABIC_META_DESCRIPTION,
    keywordsAr: settings?.arabicPrimaryKeywords?.length
      ? [
          ...(settings.arabicPrimaryKeywords || []),
          ...(settings.arabicSecondaryKeywords || []).slice(0, 6),
        ]
      : allArabicKeywordsFlat().slice(0, 15),
  }
}
