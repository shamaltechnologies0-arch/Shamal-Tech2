import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { getServerSideURL } from './getURL'
import { getRequestLocale } from '../lib/i18n/getRequestLocale'
import { buildPageMetadata } from '../lib/seo/pageMetadata'

function withServerUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const serverUrl = getServerSideURL().replace(/\/$/, '')
  return `${serverUrl}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    if (ogUrl) return withServerUrl(ogUrl)
    if (image.url) return withServerUrl(image.url)
  }

  return withServerUrl('/media/hero-banners/hero-products.webp')
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  /** Public path without a locale prefix. Blog posts use `/posts/[slug]`. */
  path?: string
}): Promise<Metadata> => {
  const { doc } = args
  const locale = await getRequestLocale()
  const isAr = locale === 'ar'
  const ogImage = getImageURL(doc?.meta?.image)

  const slug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
  const path = args.path || (!slug || slug === 'home' ? '/' : `/${slug}`)

  const titleAr = (doc as { titleAr?: string | null } | null)?.titleAr
  const descriptionAr = (doc as { descriptionAr?: string | null } | null)?.descriptionAr
  const pageTitle = (doc as { title?: string | null } | null)?.title
  const brand = isAr ? 'شمل للتقنيات' : 'Shamal Technologies'

  const rawTitle = isAr
    ? titleAr || doc?.meta?.title || pageTitle || brand
    : doc?.meta?.title || pageTitle || brand
  const title = rawTitle.includes(brand) ? rawTitle : `${rawTitle} | ${brand}`

  const description = isAr
    ? descriptionAr || doc?.meta?.description || ''
    : doc?.meta?.description || (doc as { description?: string | null } | null)?.description || ''

  const tags = ((doc as { tags?: Array<string | null> | null } | null)?.tags || []).filter(
    (value): value is string => Boolean(value),
  )
  const extraKeywords = [pageTitle, titleAr, ...tags].filter((value): value is string => Boolean(value))

  return buildPageMetadata({
    locale,
    pathWithoutLocale: path,
    title,
    description,
    keywords: extraKeywords,
    images: ogImage ? [{ url: ogImage }] : undefined,
  })
}
