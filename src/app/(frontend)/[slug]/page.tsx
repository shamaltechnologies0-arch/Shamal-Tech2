import type { Metadata } from 'next'

import { PayloadRedirects } from '../../../components/PayloadRedirects'
import configPromise from '../../../payload.config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import React from 'react'
import { homeStatic } from '../../../endpoints/seed/home-static'
import { unstable_cache } from 'next/cache'

import { RenderBlocks } from '../../../blocks/RenderBlocks'
import { RenderHero } from '../../../heros/RenderHero'
import { generateMeta } from '../../../utilities/generateMeta'
import PageClient from './page.client'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    // Add timeout to prevent build hangs
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    )

    const payloadPromise = getPayload({ config: configPromise })
    const payload = await Promise.race([payloadPromise, timeoutPromise]) as Awaited<ReturnType<typeof getPayload>>

    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    const params = pages.docs
      ?.filter((doc) => {
        return doc.slug !== 'home'
      })
      .map(({ slug }) => {
        return { slug }
      })

    return params || []
  } catch (error) {
    // Log error but don't fail the build
    console.warn('Failed to generate static params for pages:', error)
    // Return empty array to allow build to continue
    // Pages will be generated dynamically at runtime
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({ slug }: { slug: string }) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'pages',
        draft: false,
        limit: 1,
        pagination: false,
        overrideAccess: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      return result.docs?.[0] || null
    },
    ['pages', 'bySlug', slug],
    { tags: ['collection_pages'], revalidate }
  )()
