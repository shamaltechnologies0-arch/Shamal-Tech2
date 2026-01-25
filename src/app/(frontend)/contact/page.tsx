import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import { ContactForm } from '../../../components/ContactForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { ScrollReveal, CinematicReveal } from '../../../utilities/animations'

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
      mapEmbedUrl?: string
      mapLink?: string
    }
  } | null

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
      slug: true,
    },
  })

  return (
    <main className="flex flex-col relative">
      {/* Hero Section - Reduced Height */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.1} duration={1.2}>
            <div className="container mx-auto px-4 w-full">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge
                  variant="outline"
                  className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
                >
                  Get In Touch
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight text-white drop-shadow-lg">
                  Contact Us
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
                  Get in touch with our team to discuss your project needs
                </p>
              </div>
            </div>
          </CinematicReveal>
        </ParallaxElement>
      </ScrollSection>

      {/* Contact Section - Flexible Height */}
      <ScrollSection id="contact" flexible bgVariant="1" parallax>
        <div className="container mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <ScrollReveal direction="left" delay={0.2} duration={1}>
              <Card className="border-2 border-logo-blue/20 shadow-xl bg-background/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-3xl font-display font-bold text-logo-navy">
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-base text-logo-blue font-medium">
                    Fill out the form below and we&apos;ll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm services={services.docs} />
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Contact Information */}
            <div className="space-y-6">
              <ScrollReveal direction="right" delay={0.3} duration={1}>
                <Card className="border-2 border-logo-blue/20 shadow-xl bg-background/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-3xl font-display font-bold text-logo-navy">
                      Contact Information
                    </CardTitle>
                    <CardDescription className="text-base text-logo-blue font-medium">
                      Reach out to us through any of these channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {siteSettings?.contactInfo?.phone && (
                      <div className="flex gap-4">
                        <div className="p-3 rounded-lg bg-logo-blue/10">
                          <Phone className="h-5 w-5 text-logo-blue" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-logo-navy mb-1">Phone</h3>
                          <a
                            href={`tel:${siteSettings.contactInfo.phone}`}
                            className="text-logo-blue hover:text-logo-navy hover:underline font-medium"
                          >
                            {siteSettings.contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {siteSettings?.contactInfo?.email && (
                      <div className="flex gap-4">
                        <div className="p-3 rounded-lg bg-logo-blue/10">
                          <Mail className="h-5 w-5 text-logo-blue" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-logo-navy mb-1">Email</h3>
                          <a
                            href={`mailto:${siteSettings.contactInfo.email}`}
                            className="text-logo-blue hover:text-logo-navy hover:underline font-medium"
                          >
                            {siteSettings.contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {siteSettings?.contactInfo?.address && (
                      <div className="flex gap-4">
                        <div className="p-3 rounded-lg bg-logo-blue/10">
                          <MapPin className="h-5 w-5 text-logo-blue" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-logo-navy mb-1">Address</h3>
                          <p className="text-logo-blue font-medium">{siteSettings.contactInfo.address}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className="p-3 rounded-lg bg-logo-blue/10">
                        <Clock className="h-5 w-5 text-logo-blue" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-logo-navy mb-1">Business Hours</h3>
                        <p className="text-logo-blue font-medium">
                          Sunday - Thursday: 9:00 AM - 6:00 PM
                          <br />
                          Friday - Saturday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Google Maps Embed */}
              {siteSettings?.contactInfo?.mapEmbedUrl && (
                <ScrollReveal direction="right" delay={0.4} duration={1}>
                  <Card className="border-2 border-logo-blue/20 shadow-xl bg-background/95 backdrop-blur-sm overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                        Our Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                    <div className="relative w-full h-96">
                      <iframe
                        src={siteSettings.contactInfo.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Shamal Technologies Location"
                        className="absolute inset-0"
                      />
                    </div>
                      {siteSettings.contactInfo.mapLink && (
                        <div className="p-4 border-t border-logo-blue/20">
                          <a
                            href={siteSettings.contactInfo.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-logo-blue hover:text-logo-navy hover:underline text-sm font-semibold"
                          >
                            View on Google Maps →
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}
            </div>
          </div>
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
