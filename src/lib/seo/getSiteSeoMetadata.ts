import type { Metadata } from 'next'

import { getServerSideURL } from '../../utilities/getURL'
import { getRequestInternalPathname, getRequestLocale } from '../i18n/getRequestLocale'
import { htmlLang } from '../i18n/locale'
import { ARABIC_META_DESCRIPTION, ARABIC_SITE_TITLE, allArabicKeywordsFlat } from './arabicKeywords'
import { getSeoSettingsDoc } from './cmsKeywords'
import { SITE_SEO_DESCRIPTION, SITE_SEO_TITLE } from './englishKeywords'
import { buildPageMetadata, GEO_META } from './pageMetadata'

type SeoSettingsDoc = {
  arabicPrimaryKeywords?: string[] | null
  arabicSecondaryKeywords?: string[] | null
  metaDescriptionTemplate?: string | null
  metaDescriptionTemplateAr?: string | null
}

export async function getSiteSeoMetadata(): Promise<Metadata> {
  const [settings, locale, path] = await Promise.all([
    getSeoSettingsDoc(),
    getRequestLocale(),
    getRequestInternalPathname(),
  ])

  const isAr = locale === 'ar'
  const title = isAr ? ARABIC_SITE_TITLE : SITE_SEO_TITLE
  const description = isAr
    ? settings?.metaDescriptionTemplateAr || ARABIC_META_DESCRIPTION
    : settings?.metaDescriptionTemplate || SITE_SEO_DESCRIPTION

  const page = await buildPageMetadata({
    locale,
    pathWithoutLocale: path,
    title,
    description,
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
      'apple-mobile-web-app-title': isAr ? 'شمل للتقنيات' : 'Shamal Technologies',
      'application-name': isAr ? 'شمل للتقنيات' : 'Shamal Technologies',
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
