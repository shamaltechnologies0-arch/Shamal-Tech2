import type { Metadata } from 'next'

import { getRequestInternalPathname, getRequestLocale } from '../i18n/getRequestLocale'
import type { Locale } from '../i18n/locale'
import { buildLanguageAlternates } from './alternates'
import { buildPageMetadata } from './pageMetadata'

type LocaleCopy = {
  title: string
  description: string
  keywords?: string[]
}

export async function localizedPageMetadata(copy: { en: LocaleCopy; ar: LocaleCopy }): Promise<Metadata> {
  const locale = await getRequestLocale()
  const path = await getRequestInternalPathname()
  const fields = locale === 'ar' ? copy.ar : copy.en

  return buildPageMetadata({
    locale,
    pathWithoutLocale: path,
    title: fields.title,
    description: fields.description,
    keywords: fields.keywords,
  })
}

export async function withLocaleAlternates(metadata: Metadata): Promise<Metadata> {
  const locale = await getRequestLocale()
  const path = await getRequestInternalPathname()
  return {
    ...metadata,
    alternates: {
      ...buildLanguageAlternates(path, locale),
      ...metadata.alternates,
    },
  }
}

export async function currentLocale(): Promise<Locale> {
  return getRequestLocale()
}
