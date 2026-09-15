import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { getServerSideURL } from './getURL'
import { getRequestLocale } from '../lib/i18n/getRequestLocale'
import { defaultKeywords, buildPageMetadata } from '../lib/seo/pageMetadata'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/media/hero-banners/hero-products.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args
  const locale = await getRequestLocale()
  const isAr = locale === 'ar'
  const ogImage = getImageURL(doc?.meta?.image)

  const slug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
  const path = !slug || slug === 'home' ? '/' : `/${slug}`

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

  const extraKeywords = [pageTitle, titleAr].filter((value): value is string => Boolean(value))

  return buildPageMetadata({
    locale,
    pathWithoutLocale: path,
    title,
    description,
    keywords: [...extraKeywords, ...defaultKeywords(locale)],
    images: ogImage ? [{ url: ogImage }] : undefined,
  })
}
