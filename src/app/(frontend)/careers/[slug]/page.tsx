import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { LivePreviewListener } from '../../../../components/LivePreviewListener'
import { CareerDetailContent } from '../../../../components/sections/CareerDetailContent.client'
import type { Career } from '../../../../payload-types'

const getCareerBySlug = cache(async (slug: string): Promise<Career | null> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const where: {
    slug: { equals: string }
    status?: { equals: 'published' }
  } = {
    slug: {
      equals: slug,
    },
  }

  // Only filter by published status if not in draft mode
  if (!draft) {
    where.status = {
      equals: 'published',
    }
  }

  const result = await payload.find({
    collection: 'career',
    where,
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  })

  return (result.docs[0] as Career | undefined) || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const careers = await payload.find({
    collection: 'career',
    limit: 1000,
    where: {
      status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
    },
  })
  return careers.docs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const career = await getCareerBySlug(slug)

  if (!career) {
    return {
      title: 'Career Not Found',
    }
  }

  const metaTitle = career.seo?.title || `${career.title} | Shamal Technologies Careers`
  const metaDescription = career.seo?.description || ''

  return {
    title: metaTitle,
    description: metaDescription,
  }
}

export default async function CareerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const career = await getCareerBySlug(slug)

  if (!career) {
    notFound()
  }

  return (
    <>
      {draft && <LivePreviewListener />}
      <CareerDetailContent career={career as any} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: career.title,
            description: career.seo?.description || '',
            identifier: {
              '@type': 'PropertyValue',
              name: 'Shamal Technologies',
              value: career.id,
            },
            datePosted: career.createdAt,
            validThrough: career.applicationDeadline || undefined,
            employmentType: career.employmentType || '',
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: career.location || 'Saudi Arabia',
              },
            },
            baseSalary: career.salaryRange
              ? {
                  '@type': 'MonetaryAmount',
                  currency: 'SAR',
                  value: {
                    '@type': 'QuantitativeValue',
                    value: career.salaryRange,
                  },
                }
              : undefined,
            hiringOrganization: {
              '@type': 'Organization',
              name: 'Shamal Technologies',
              sameAs: process.env.NEXT_PUBLIC_SITE_URL || 'https://shamal.sa',
            },
          }),
        }}
      />
    </>
  )
}

