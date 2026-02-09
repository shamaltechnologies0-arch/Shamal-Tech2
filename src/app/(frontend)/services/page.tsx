import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { ArrowRight } from 'lucide-react'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { CinematicReveal } from '../../../utilities/animations'
import { ServicesShowcaseCarousel } from '../../../components/sections/ServicesShowcaseCarousel.client'
import { SlidingServicesSection } from '../../../components/sections/SlidingServicesSection.client'
import { ServicesPageHero } from '../../../components/sections/ServicesPageHero.client'
import { ServicesCTASection } from '../../../components/sections/ServicesCTASection.client'
import { getCachedGlobal } from '../../../utilities/getGlobals'

export async function generateMetadata(): Promise<Metadata> {
  const servicesPageContent = (await getCachedGlobal('services-page-content', 2)()) as {
    hero?: {
      title?: string
      subtitle?: string
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

  return {
    title: servicesPageContent?.seo?.metaTitle || servicesPageContent?.hero?.title || 'Our Services | Shamal Technologies',
    description: servicesPageContent?.seo?.metaDescription || servicesPageContent?.hero?.subtitle || 'Comprehensive drone and geospatial solutions including aerial survey, construction monitoring, asset inspection, and more.',
  }
}

export default async function ServicesPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch services page content from global
  const servicesPageContent = (await getCachedGlobal('services-page-content', 3)()) as {
    hero?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      subtitle?: string
      subtitleAr?: string
      backgroundImage?: {
        id?: string
        url?: string
        alt?: string
        mimeType?: string
      } | string | null
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

  // Fetch published services - use same sorting as homepage for consistency
  // Sort by order field (ascending), then by createdAt as fallback
  let servicesResult = await payload.find({
    collection: 'services',
    limit: 100,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: 'order', // Sort by admin-controlled order field (same as homepage)
    depth: 2, // Ensure relationships (like heroImage) are populated (same as homepage)
    draft: false, // Explicitly exclude drafts
    overrideAccess: false, // Respect access control
  })

  // Ensure proper sorting: services with order field first (ascending), then by createdAt
  // This handles cases where order might be null/undefined and matches homepage sorting
  let services = {
    ...servicesResult,
    docs: [...servicesResult.docs].sort((a, b) => {
      const orderA = a.order ?? 999
      const orderB = b.order ?? 999
      if (orderA !== orderB) {
        return orderA - orderB
      }
      // If order is the same, sort by createdAt (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }),
  }

  // If no published services, get all services (for development)
  if (services.docs.length === 0) {
    services = await payload.find({
      collection: 'services',
      limit: 100,
      sort: 'title',
      depth: 1,
    })
  }

  // Get hero content from CMS - passed to client component for language support
  const heroBackgroundImage = servicesPageContent?.hero?.backgroundImage

  return (
    <main className="flex flex-col relative">
      {/* Hero Section - Reduced Height */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        {/* Background Image */}
        {/* Use only the URL from the API (S3 in production — do not use local /media/ paths) */}
        {heroBackgroundImage &&
        typeof heroBackgroundImage === 'object' &&
        heroBackgroundImage !== null &&
        heroBackgroundImage.url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={
                heroBackgroundImage.url.startsWith('http')
                  ? heroBackgroundImage.url
                  : heroBackgroundImage.url.startsWith('/')
                    ? heroBackgroundImage.url
                    : `/${heroBackgroundImage.url}`
              }
              alt={heroBackgroundImage.alt || 'Services page hero background'}
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <ServicesPageHero
          badge={servicesPageContent?.hero?.badge}
          badgeAr={servicesPageContent?.hero?.badgeAr}
          title={servicesPageContent?.hero?.title}
          titleAr={servicesPageContent?.hero?.titleAr}
          subtitle={servicesPageContent?.hero?.subtitle}
          subtitleAr={servicesPageContent?.hero?.subtitleAr}
        />
      </ScrollSection>

      {/* Dynamic Sliding Services Section */}
      {services.docs.length > 0 && (
        <SlidingServicesSection
          services={services.docs.map((service) => ({
            id: String(service.id),
            title: service.title || null,
            titleAr: service.titleAr || null,
            slug: service.slug || null,
          }))}
        />
      )}

      {/* Services Showcase Carousel - Flexible Height */}
      <ScrollSection id="services" flexible bgVariant="1" parallax>
        <div className="container mx-auto px-4 w-full py-12 lg:py-16">
          {services.docs.length === 0 ? (
            <CinematicReveal delay={0.2} duration={1}>
              <Card className="max-w-2xl mx-auto border-2 border-logo-blue/30 shadow-xl bg-background/95 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                    No Services Available
                  </CardTitle>
                  <CardDescription className="text-base text-logo-blue font-medium">
                    Please check back later or contact us for more information.
                  </CardDescription>
                </CardHeader>
              </Card>
            </CinematicReveal>
          ) : (
            <ServicesShowcaseCarousel services={services.docs} />
          )}
        </div>
      </ScrollSection>

      {/* CTA Section - Full Viewport */}
      <ScrollSection id="cta" fullViewport bgVariant="gradient" parallax>
        <ServicesCTASection />
      </ScrollSection>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Our Services',
            description: 'Comprehensive drone and geospatial solutions',
            itemListElement: services.docs.map((service, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Service',
                name: service.title,
                description: service.heroDescription || '',
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://shamal.sa'}/services/${service.slug}`,
              },
            })),
          }),
        }}
      />
    </main>
  )
}
