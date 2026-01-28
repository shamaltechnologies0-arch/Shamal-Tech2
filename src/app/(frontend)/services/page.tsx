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
      title?: string
      subtitle?: string
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

  // Get hero content from CMS or use defaults
  const heroTitle = servicesPageContent?.hero?.title || 'Our Services'
  const heroSubtitle = servicesPageContent?.hero?.subtitle || 'Comprehensive drone and geospatial solutions for your business needs'
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
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.1} duration={1.2}>
            <div className="container mx-auto px-4 w-full relative z-10">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge
                  variant="outline"
                  className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
                >
                  Services
                </Badge>
                <h1 className="text-hero font-display font-bold tracking-tight text-white drop-shadow-2xl">
                  {heroTitle}
                </h1>
                {heroSubtitle && (
                  <p className="text-body-large text-white/95 max-w-3xl mx-auto font-medium drop-shadow-lg">
                    {heroSubtitle}
                  </p>
                )}
              </div>
            </div>
          </CinematicReveal>
        </ParallaxElement>
      </ScrollSection>

      {/* Dynamic Sliding Services Section */}
      {services.docs.length > 0 && (
        <SlidingServicesSection
          services={services.docs.map((service) => ({
            id: String(service.id),
            title: service.title || null,
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
        <div className="container mx-auto px-4 w-full">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.2} duration={1.2} scale>
              <Card className="max-w-4xl mx-auto border-2 border-white/30 shadow-2xl bg-background/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-6">
                  <Badge
                    variant="outline"
                    className="w-fit mx-auto border-logo-blue/60 text-logo-blue bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold shadow-md"
                  >
                    Get Started
                  </Badge>
                  <CardTitle className="text-display-large font-display font-bold text-foreground">
                    <span className="text-gradient">Ready to Transform Your Projects?</span>
                  </CardTitle>
                  <CardDescription className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    Contact us today to discuss how our services can help you achieve your goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    asChild
                    size="lg"
                    className="text-base px-8 h-14 bg-logo-blue hover:bg-logo-blue/90"
                  >
                    <Link href="/contact">
                      Contact Us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </CinematicReveal>
          </ParallaxElement>
        </div>
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
