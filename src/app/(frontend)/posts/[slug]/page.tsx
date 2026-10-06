import type { Metadata } from 'next'

import { RelatedPosts } from '../../../../blocks/RelatedPosts/Component'
import { PayloadRedirects } from '../../../../components/PayloadRedirects'
import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import React from 'react'
import { unstable_cache } from 'next/cache'

import type { Post } from '../../../../payload-types'

import { PostContentClient } from './PostContentClient'
import { PostHeroClient } from '../../../../heros/PostHero/PostHeroClient'
import { BlogCTASection } from '../../../../components/sections/BlogCTASection.client'
import { generateMeta } from '../../../../utilities/generateMeta'
import { getCachedGlobal } from '../../../../utilities/getGlobals'
import { getServerSideURL } from '../../../../utilities/getURL'
import { getRequestLocale } from '../../../../lib/i18n/getRequestLocale'
import { getLocalizedValue } from '../../../../lib/localization'
import { getBlogPostingSchema } from '../../../../lib/seo/structuredData'
import PageClient from './page.client'
import type { Media } from '../../../../payload-types'

export async function generateStaticParams() {
  try {
    // Add timeout to prevent build hangs
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    )

    const payloadPromise = getPayload({ config: configPromise })
    const payload = await Promise.race([payloadPromise, timeoutPromise]) as Awaited<ReturnType<typeof getPayload>>

    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    const params = posts.docs.map(({ slug }) => {
      return { slug }
    })

    return params
  } catch (error) {
    // Log error but don't fail the build
    console.warn('Failed to generate static params for posts:', error)
    // Return empty array to allow build to continue
    // Posts will be generated dynamically at runtime
    return []
  }
}

// Allow dynamic generation for paths not in generateStaticParams
// This ensures deleted posts return 404 instead of showing cached content
export const dynamicParams = true
export const revalidate = 3600

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const [locale, postsPageContent] = await Promise.all([
    getRequestLocale(),
    getCachedGlobal('posts-page-content', 0)().catch(() => null),
  ])
  const title = getLocalizedValue(post.title, post.titleAr, locale)
  const description = getLocalizedValue(
    post.meta?.description || post.description,
    post.descriptionAr,
    locale,
  )
  const structuredData = getBlogPostingSchema({
    siteUrl: getServerSideURL(),
    locale,
    path: url,
    title,
    description,
    imageUrl: absoluteMediaUrl(post.meta?.image || post.featuredImage || post.heroImage),
    datePublished: post.publishedAt || post.date,
    dateModified: post.updatedAt,
    authorName: post.author,
    keywords: (post.tags || []).filter((tag): tag is string => Boolean(tag)),
  })

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <PostHeroClient post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <PostContentClient content={post.content} contentAr={post.contentAr} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>

      <BlogCTASection {...(postsPageContent?.cta || {})} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })
  const metadata = await generateMeta({ doc: post, path: `/posts/${decodedSlug}` })
  if (!post) return metadata

  const publishedTime = post.publishedAt || post.date || undefined
  const brandedTitle = typeof metadata.title === 'string' ? metadata.title : undefined

  return {
    ...metadata,
    title: brandedTitle ? { absolute: brandedTitle } : metadata.title,
    authors: post.author ? [{ name: post.author }] : undefined,
    category: post.category || undefined,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: post.updatedAt || publishedTime,
      authors: post.author ? [post.author] : undefined,
      tags: (post.tags || []).filter((tag): tag is string => Boolean(tag)),
    },
  }
}

function absoluteMediaUrl(image?: string | Media | null) {
  if (!image || typeof image === 'string') return null
  const raw = image.sizes?.og?.url || image.url
  if (!raw) return null
  if (raw.startsWith('http')) return raw
  return `${getServerSideURL()}${raw.startsWith('/') ? raw : `/${raw}`}`
}

const queryPostBySlug = async ({ slug }: { slug: string }) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'posts',
        draft: false,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        where: {
          slug: {
            equals: slug,
          },
          _status: {
            equals: 'published',
          },
        },
      })

      return result.docs?.[0] || null
    },
    ['posts', 'bySlug', slug, 'media'],
    { tags: ['collection_posts'], revalidate }
  )()
