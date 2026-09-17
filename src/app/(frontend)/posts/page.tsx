import type { Metadata } from 'next/types'

import { PageRangeClient } from '../../../components/PageRange/PageRangeClient'
import { Pagination } from '../../../components/Pagination'
import { PostsClient } from './PostsClient'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import Image from 'next/image'
import { PostsPageHero } from '../../../components/sections/PostsPageHero.client'
import React from 'react'
import PageClient from './page.client'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { CinematicReveal } from '../../../utilities/animations'
import { safePayloadFindCached } from '../../../utilities/safePayloadQuery'
import { getRequestLocale } from '../../../lib/i18n/getRequestLocale'
import { buildPageMetadata } from '../../../lib/seo/pageMetadata'

export const revalidate = 600

export default async function Page() {
  const [postsPageContent, posts] = await Promise.all([
    getCachedGlobal('posts-page-content', 2)(),
    safePayloadFindCached({
      cacheKeyParts: ['posts-page', 'posts', 'limit:12', 'depth:1', 'select:card'],
      tags: ['collection_posts'],
      revalidate,
      options: {
        collection: 'posts',
        depth: 1,
        limit: 12,
        overrideAccess: false,
        select: {
          title: true,
          titleAr: true,
          description: true,
          descriptionAr: true,
          slug: true,
          categories: true,
          meta: true,
          featuredImage: true,
          heroImage: true,
        },
      },
    }),
  ])

  const pageContent = postsPageContent as {
    hero?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      backgroundImage?:
        | {
            url?: string
            alt?: string
          }
        | string
        | null
    }
    seo?: {
      metaTitle?: string
      metaDescription?: string
      ogImage?: {
        url?: string
        alt?: string
      } | null
    }
  } | null

  return (
    <main className="flex flex-col relative">
      {/* Hero Section - Reduced Height */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        {/* Background Image */}
        {(() => {
          const bg = pageContent?.hero?.backgroundImage
          if (!bg || typeof bg !== 'object') return null

          const { url, alt } = bg as { url?: string; alt?: string }
          // Use only the URL from the API (S3 in production — do not use local /media/ paths)
          if (!url) return null

          const src =
            url.startsWith('http') ? url : url.startsWith('/') ? url : `/${url}`

          return (
            <div className="absolute inset-0 z-0">
              <Image
                src={src}
                alt={alt || 'Blog posts background'}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          )
        })()}
        <div className="relative z-10 container mx-auto px-4 py-20 w-full">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.1} duration={1.2}>
              <PostsPageHero
                badge={pageContent?.hero?.badge}
                badgeAr={pageContent?.hero?.badgeAr}
                title={pageContent?.hero?.title}
                titleAr={pageContent?.hero?.titleAr}
                description={pageContent?.hero?.description}
                descriptionAr={pageContent?.hero?.descriptionAr}
              />
            </CinematicReveal>
          </ParallaxElement>
        </div>
      </ScrollSection>

      <div className="py-16">
        <PageClient />
        <div className="container mb-8">
          <PageRangeClient
            collection="posts"
            currentPage={posts.page}
            limit={12}
            totalDocs={posts.totalDocs}
          />
        </div>

        <PostsClient posts={posts.docs} />

        <div className="container mt-8">
          {posts.totalPages > 1 && posts.page && (
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const postsPageContent = (await getCachedGlobal('posts-page-content', 2)()) as {
    hero?: {
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
    }
    seo?: {
      metaTitle?: string
      metaDescription?: string
      metaTitleAr?: string
      metaDescriptionAr?: string
      ogImage?: {
        url?: string
        alt?: string
      } | null
    }
  } | null

  const isAr = locale === 'ar'
  const title = isAr
    ? postsPageContent?.seo?.metaTitleAr ||
      postsPageContent?.hero?.titleAr ||
      'المدونة | شمل للتقنيات'
    : postsPageContent?.seo?.metaTitle ||
      postsPageContent?.hero?.title ||
      'Blog Posts | Shamal Technologies'
  const description = isAr
    ? postsPageContent?.seo?.metaDescriptionAr ||
      postsPageContent?.hero?.descriptionAr ||
      'أحدث الرؤى حول الطائرات بدون طيار والمسح الجغرافي وحلول البيانات في السعودية.'
    : postsPageContent?.seo?.metaDescription ||
      'Insights on drone surveying, geospatial data, and DJI technology from Shamal Technologies in Saudi Arabia.'

  return buildPageMetadata({
    locale,
    pathWithoutLocale: '/posts',
    title,
    description,
    keywords: isAr
      ? ['مدونة شمل للتقنيات', 'مقالات درون السعودية']
      : ['Shamal Technologies blog', 'drone surveying insights'],
    images: postsPageContent?.seo?.ogImage?.url
      ? [{ url: postsPageContent.seo.ogImage.url as string, alt: title }]
      : undefined,
  })
}
