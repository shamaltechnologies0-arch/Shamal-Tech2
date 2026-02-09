import type { Metadata } from 'next'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { LivePreviewListener } from '../../../../components/LivePreviewListener'
import { ServiceHeroSection } from '../../../../components/sections/ServiceHeroSection.client'
import { ServiceDetailContent } from '../../../../components/sections/ServiceDetailContent.client'
import { ServiceBreadcrumb } from '../../../../components/sections/ServiceBreadcrumb.client'

// Non-cached version for draft mode
async function getServiceBySlugUncached(slug: string) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  
  const where: any = {
    slug: {
      equals: slug,
    },
  }
  
  // Only filter by published status if not in draft mode
  if (!draft) {
    where._status = {
      equals: 'published',
    }
  }
  
  const result = await payload.find({
    collection: 'services',
    where,
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  })
  return result.docs[0] || null
}

// Cached version for production (non-draft) mode
const getServiceBySlugCached = cache(getServiceBySlugUncached)

export async function generateStaticParams() {
  try {
    // Add timeout to prevent build hangs
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    )

    const payloadPromise = getPayload({ config: configPromise })
    const payload = await Promise.race([payloadPromise, timeoutPromise]) as Awaited<ReturnType<typeof getPayload>>

    const services = await payload.find({
      collection: 'services',
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
      },
    })
    return services.docs.map((service) => ({ slug: service.slug }))
  } catch (error) {
    // Log error but don't fail the build
    console.warn('Failed to generate static params for services:', error)
    // Return empty array to allow build to continue
    // Services will be generated dynamically at runtime
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const service = draft ? await getServiceBySlugUncached(slug) : await getServiceBySlugCached(slug)

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: service.seo?.title || `${service.title} | Shamal Technologies`,
    description: service.seo?.description || service.heroDescription || '',
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  // Don't cache in draft mode to ensure fresh data when RefreshRouteOnSave triggers refresh
  const service = draft ? await getServiceBySlugUncached(slug) : await getServiceBySlugCached(slug)

  if (!service) {
    return <div>Service not found</div>
  }

  return (
    <main className="flex flex-col relative">
      {draft && <LivePreviewListener />}
      
      {/* Hero Section - Full Viewport */}
      <ServiceHeroSection
        slug={slug}
        title={service.title}
        titleAr={(service as { titleAr?: string }).titleAr}
        heroDescription={service.heroDescription}
        heroDescriptionAr={(service as { heroDescriptionAr?: string }).heroDescriptionAr}
        heroImage={service.heroImage as { url?: string } | null}
      />

      <ServiceDetailContent service={service} />

      {/* Breadcrumb */}
      <ServiceBreadcrumb
        title={service.title}
        titleAr={(service as { titleAr?: string }).titleAr}
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.heroDescription || service.seo?.description || '',
            provider: {
              '@type': 'Organization',
              name: 'Shamal Technologies',
            },
            areaServed: {
              '@type': 'Country',
              name: 'Saudi Arabia',
            },
          }),
        }}
      />
    </main>
  )
}

