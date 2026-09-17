import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import type { SeoKeyword, SeoSetting } from '../../payload-types'
import configPromise from '@/payload.config'
import { getCachedGlobal } from '../../utilities/getGlobals'
import type { Locale } from '../i18n/locale'
import { allArabicKeywordsFlat } from './arabicKeywords'
import { allEnglishKeywordsFlat, TARGET_BRAND_KEYWORDS } from './englishKeywords'

const KEYWORD_LIMIT = 200

type CachedKeyword = {
  keyword: string
  language: 'en' | 'ar'
  category: SeoKeyword['category']
  priority: number
}

function uniqueKeywords(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const keyword = value?.replace(/\s+/g, ' ').trim()
    if (!keyword) continue
    const key = keyword.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(keyword)
    if (result.length >= KEYWORD_LIMIT) break
  }

  return result
}

function flattenKeywordValue(value: unknown): string[] {
  if (!value) return []
  if (typeof value === 'string') {
    return value
      .split(/[,|\n]/)
      .map((part) => part.trim())
      .filter(Boolean)
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry) => flattenKeywordValue(entry))
  }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !key.startsWith('_'))
      .flatMap(([, nested]) => flattenKeywordValue(nested))
  }
  return []
}

function keywordsFromPathMap(map: unknown, pathWithoutLocale: string): string[] {
  if (!map || typeof map !== 'object' || Array.isArray(map)) return []

  const record = map as Record<string, unknown>
  const normalizedPath = (pathWithoutLocale || '/').toLowerCase()
  const segments = normalizedPath.split('/').filter(Boolean)
  const pageKey = segments[0] || 'home'
  const lastKey = segments[segments.length - 1] || 'home'
  const needles = new Set(['home', pageKey, lastKey, normalizedPath.replace(/^\//, '')])

  const matched: string[] = []

  for (const [rawKey, rawValue] of Object.entries(record)) {
    if (rawKey.startsWith('_')) continue
    const key = rawKey.toLowerCase().trim()
    if (!key) continue

    const isMatch = [...needles].some(
      (needle) => key === needle || key.includes(needle) || needle.includes(key),
    )
    if (!isMatch) continue
    matched.push(...flattenKeywordValue(rawValue))
  }

  return matched
}

const getCachedActiveSeoKeywords = unstable_cache(
  async (): Promise<CachedKeyword[]> => {
    try {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'seo-keywords',
        where: { active: { equals: true } },
        sort: '-priority',
        limit: KEYWORD_LIMIT,
        depth: 0,
        pagination: false,
      })

      return result.docs
        .map((doc) => ({
          keyword: doc.keyword,
          language: doc.language,
          category: doc.category,
          priority: typeof doc.priority === 'number' ? doc.priority : 5,
        }))
        .filter((doc) => Boolean(doc.keyword))
    } catch {
      return []
    }
  },
  ['seo-keywords-active'],
  {
    tags: ['collection_seo-keywords'],
    revalidate: false,
  },
)

export async function getSeoSettingsDoc(): Promise<SeoSetting | null> {
  try {
    return (await getCachedGlobal('seo-settings', 0)()) as SeoSetting
  } catch {
    return null
  }
}

export async function resolvePageKeywords({
  locale,
  pathWithoutLocale = '/',
  extra = [],
}: {
  locale: Locale
  pathWithoutLocale?: string
  extra?: string[]
}): Promise<string[]> {
  const fallback = locale === 'ar' ? allArabicKeywordsFlat() : allEnglishKeywordsFlat()

  try {
    const [settings, collectionKeywords] = await Promise.all([
      getSeoSettingsDoc(),
      getCachedActiveSeoKeywords(),
    ])

    const isAr = locale === 'ar'
    const cmsList = isAr
      ? [
          ...(settings?.arabicPrimaryKeywords || []),
          ...(settings?.arabicSecondaryKeywords || []),
          ...(settings?.arabicLongTailKeywords || []),
        ]
      : [
          ...(settings?.primaryKeywords || []),
          ...(settings?.secondaryKeywords || []),
          ...(settings?.longTailKeywords || []),
        ]

    const fromCollection = collectionKeywords
      .filter((item) => item.language === locale)
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.keyword)

    const fromMaps = [
      ...keywordsFromPathMap(settings?.serviceKeywords, pathWithoutLocale),
      ...keywordsFromPathMap(settings?.sectorKeywords, pathWithoutLocale),
    ]

    const cmsOrFallback = cmsList.length > 0 || fromCollection.length > 0 ? cmsList : fallback

    return uniqueKeywords([
      ...TARGET_BRAND_KEYWORDS,
      ...extra,
      ...cmsOrFallback,
      ...fromCollection,
      ...fromMaps,
    ])
  } catch {
    return uniqueKeywords([...TARGET_BRAND_KEYWORDS, ...extra, ...fallback])
  }
}
