import type { Metadata } from 'next/types'

import { PageRange } from '../../../components/PageRange'
import { Pagination } from '../../../components/Pagination'
import { PostsClient } from './PostsClient'
import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import { LivePreviewListener } from '../../../components/LivePreviewListener'
import Image from 'next/image'
import { Badge } from '../../../components/ui/badge'
import React from 'react'
import PageClient from './page.client'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { CinematicReveal } from '../../../utilities/animations'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  // Fetch posts page content from global
  const postsPageContent = (await getCachedGlobal('posts-page-content', 2)()) as {
    hero?: {
      title?: string
      description?: string
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

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      featuredImage: true,
      heroImage: true,
    },
  })

  return (
    <main className="flex flex-col relative">
      {draft && <LivePreviewListener />}

      {/* Hero Section - Reduced Height */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        {/* Background Image */}
        {(() => {
          const bg = postsPageContent?.hero?.backgroundImage
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
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge
                  variant="outline"
                  className="mb-6 border-white/30 text-white bg-white/10 mt-20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
                >
                  Insights
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight text-white drop-shadow-lg">
                  {postsPageContent?.hero?.title || 'Blog Posts'}
                </h1>
                {postsPageContent?.hero?.description && (
                  <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
                    {postsPageContent.hero.description}
                  </p>
                )}
              </div>
            </CinematicReveal>
          </ParallaxElement>
        </div>
      </ScrollSection>

      <div className="py-16">
        <PageClient />
        <div className="container mb-8">
          <PageRange
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
  const postsPageContent = (await getCachedGlobal('posts-page-content', 2)()) as {
    hero?: {
      title?: string
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

  const metaTitle =
    postsPageContent?.seo?.metaTitle ||
    postsPageContent?.hero?.title ||
    'Blog Posts | Shamal Technologies'
  const metaDescription = postsPageContent?.seo?.metaDescription || ''
  const ogImage =
    postsPageContent?.seo?.ogImage &&
    typeof postsPageContent.seo.ogImage === 'object' &&
    'url' in postsPageContent.seo.ogImage
      ? (postsPageContent.seo.ogImage.url as string)
      : undefined

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}
