import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { CinematicReveal } from '../../../utilities/animations'
import { ContactPageHero } from '../../../components/sections/ContactPageHero.client'
import { ContactPageContent } from '../../../components/sections/ContactPageContent.client'

export const metadata: Metadata = {
  title: 'Contact Us | Shamal Technologies',
  description:
    'Get in touch with Shamal Technologies for drone survey and geospatial solutions in Saudi Arabia.',
}

export default async function ContactPage() {
  const payload = await getPayload({ config: configPromise })

  const siteSettings = (await getCachedGlobal('site-settings', 2)()) as {
    siteName?: string
    siteDescription?: string
    contactInfo?: {
      phone?: string
      email?: string
      address?: string
      addressAr?: string
      mapEmbedUrl?: string
      mapLink?: string
    }
  } | null

  const contactPageContent = (await getCachedGlobal('contact-page-content', 2)()) as {
    hero?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      subtitle?: string
      subtitleAr?: string
      backgroundImage?:
        | {
            url?: string
            alt?: string
          }
        | string
        | null
    }
  } | null

  const heroBackgroundImage = contactPageContent?.hero?.backgroundImage

  // Use only the URL from the API (S3 in production — do not use local /media/ paths)
  let heroBackgroundImageSrc: string | null = null
  if (heroBackgroundImage && typeof heroBackgroundImage === 'object') {
    const url = (heroBackgroundImage as { url?: string }).url
    if (url) {
      heroBackgroundImageSrc = url.startsWith('http')
        ? url
        : url.startsWith('/')
          ? url
          : `/${url}`
    }
  }

  // Fetch services for the form checkboxes
  const services = await payload.find({
    collection: 'services',
    limit: 100,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      id: true,
      title: true,
      titleAr: true,
      slug: true,
    },
  })

  return (
    <main className="flex flex-col relative">
      {/* Hero Section - Reduced Height */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        {/* Background Image */}
        {heroBackgroundImageSrc && (
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroBackgroundImageSrc}
              alt={
                (heroBackgroundImage && typeof heroBackgroundImage === 'object'
                  ? (heroBackgroundImage as { alt?: string }).alt
                  : undefined) || 'Contact page background'
              }
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.1} duration={1.2}>
            <ContactPageHero
              badge={contactPageContent?.hero?.badge}
              badgeAr={contactPageContent?.hero?.badgeAr}
              title={contactPageContent?.hero?.title}
              titleAr={contactPageContent?.hero?.titleAr}
              subtitle={contactPageContent?.hero?.subtitle}
              subtitleAr={contactPageContent?.hero?.subtitleAr}
            />
          </CinematicReveal>
        </ParallaxElement>
      </ScrollSection>

      {/* Contact Section - Flexible Height */}
      <ScrollSection id="contact" flexible bgVariant="1" parallax>
        <div className="container mx-auto px-4 w-full">
          <ContactPageContent
            services={services.docs.map((s) => ({
              id: String(s.id),
              title: s.title,
              titleAr: (s as { titleAr?: string }).titleAr,
              slug: s.slug,
            }))}
            contactInfo={siteSettings?.contactInfo}
            mapEmbedUrl={siteSettings?.contactInfo?.mapEmbedUrl}
            mapLink={siteSettings?.contactInfo?.mapLink}
          />
        </div>
      </ScrollSection>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: siteSettings?.siteName || 'Shamal Technologies',
            description: siteSettings?.siteDescription || '',
            telephone: siteSettings?.contactInfo?.phone || '+966 (0) 53 030 1370',
            email: siteSettings?.contactInfo?.email || 'hello@shamal.sa',
            address: {
              '@type': 'PostalAddress',
              streetAddress: siteSettings?.contactInfo?.address || '11th floor, Office no:1109',
              addressLocality: 'Jeddah',
              addressRegion: 'Makkah',
              postalCode: '23511',
              addressCountry: 'SA',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 21.60244686782873,
              longitude: 39.10571367472985,
            },
          }),
        }}
      />
    </main>
  )
}
