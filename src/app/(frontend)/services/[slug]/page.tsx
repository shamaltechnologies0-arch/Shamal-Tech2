import type { Metadata } from 'next'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LivePreviewListener } from '../../../../components/LivePreviewListener'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Separator } from '../../../../components/ui/separator'
import { Badge } from '../../../../components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../../components/ui/accordion'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../../components/ui/breadcrumb'
import { ArrowRight } from 'lucide-react'
import { ScrollSection } from '../../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../../components/sections/ParallaxElement'
import { ScrollReveal, StaggerReveal, CinematicReveal } from '../../../../utilities/animations'
import { getServiceImagePathBySlug, getServiceImagePath } from '../../../../utilities/getServiceImage'

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
  const payload = await getPayload({ config: configPromise })
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
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        <div className="absolute inset-0 z-0">
          <Image
            src={(() => {
              // Handle different PayloadCMS image formats
              if (service.heroImage) {
                if (typeof service.heroImage === 'string') {
                  return getServiceImagePathBySlug(slug) || getServiceImagePath(service.title)
                } else if (typeof service.heroImage === 'object') {
                  if ('url' in service.heroImage && service.heroImage.url) {
                    return service.heroImage.url as string
                  }
                }
              }
              return getServiceImagePathBySlug(slug) || getServiceImagePath(service.title)
            })()}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20 w-full">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.1} duration={1.2}>
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge
                  variant="outline"
                  className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
                >
                  Service
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight text-white drop-shadow-lg">
                  {service.title}
                </h1>
                {service.heroDescription && (
                  <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
                    {service.heroDescription}
                  </p>
                )}
              </div>
            </CinematicReveal>
          </ParallaxElement>
        </div>
      </ScrollSection>

      {/* Benefits Section */}
      {service.benefits && service.benefits.length > 0 && (
        <ScrollSection id="benefits" flexible bgVariant="1" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Benefits
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Service Benefits</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                    Discover the advantages of choosing our service
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {service.benefits.map((benefit: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {benefit.icon &&
                          typeof benefit.icon === 'object' &&
                          'url' in benefit.icon && (
                            <div className="relative h-20 w-20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Image
                                src={benefit.icon.url as string}
                                alt={benefit.title}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                            {benefit.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    {benefit.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {benefit.description}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Applications Section */}
      {service.applications && service.applications.length > 0 && (
        <ScrollSection id="applications" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Use Cases
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Applications</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                    Real-world applications of our service
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {service.applications.map((app: any, index: number) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    {app.image &&
                      typeof app.image === 'object' &&
                      'url' in app.image && (
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={app.image.url as string}
                            alt={app.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        </div>
                      )}
                    <CardHeader>
                      <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                        {app.title}
                      </CardTitle>
                    </CardHeader>
                    {app.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {app.description}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Technologies Section */}
      {service.technologies && service.technologies.length > 0 && (
        <ScrollSection id="technologies" fullViewport bgVariant="3" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Technology
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Technologies Used</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                    Cutting-edge tools and platforms we utilize
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.6}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {service.technologies.map((tech: any, index: number) => (
                  <Card
                    key={index}
                    className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      {tech.icon &&
                        typeof tech.icon === 'object' &&
                        'url' in tech.icon && (
                          <div className="relative h-28 w-28 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Image
                              src={tech.icon.url as string}
                              alt={tech.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      <CardTitle className="text-xl font-display font-bold text-logo-navy">
                        {tech.name}
                      </CardTitle>
                    </CardHeader>
                    {tech.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium">
                          {tech.description}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Portfolio Examples */}
      {service.portfolioExamples && service.portfolioExamples.length > 0 && (
        <ScrollSection id="portfolio" flexible bgVariant="1" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Portfolio
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Portfolio Examples</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                    See our work in action
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {service.portfolioExamples.map((portfolio: any) => (
                  <Card
                    key={portfolio.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm"
                  >
                    <Link href={`/portfolio/${portfolio.slug}`} className="block">
                      {portfolio.images &&
                        Array.isArray(portfolio.images) &&
                        portfolio.images[0] &&
                        typeof portfolio.images[0] === 'object' &&
                        'url' in portfolio.images[0] && (
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={portfolio.images[0].url as string}
                              alt={portfolio.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                          </div>
                        )}
                      <CardHeader>
                        <CardTitle className="text-2xl font-display font-bold text-logo-navy group-hover:text-logo-blue transition-colors">
                          {portfolio.title}
                        </CardTitle>
                      </CardHeader>
                      {portfolio.client && (
                        <CardContent>
                          <CardDescription className="text-base text-logo-blue font-medium">
                            Client: {portfolio.client}
                          </CardDescription>
                        </CardContent>
                      )}
                    </Link>
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* FAQs Section */}
      {service.faqs && service.faqs.length > 0 && (
        <ScrollSection id="faqs" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    FAQ
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Frequently Asked Questions</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                    Common questions about our service
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <ScrollReveal direction="up" delay={0.3} duration={1}>
              <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {service.faqs.map((faq: any, index: number) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-2 border-logo-blue/30 px-6 rounded-xl bg-background/95 backdrop-blur-sm"
                    >
                      <AccordionTrigger className="text-left font-display font-bold text-xl text-logo-navy hover:no-underline py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-lg max-w-none text-logo-blue font-medium pt-2 pb-4">
                          {faq.answer && (
                            <div dangerouslySetInnerHTML={{ __html: faq.answer as string }} />
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollReveal>
          </div>
        </ScrollSection>
      )}

      {/* CTA Section - Full Viewport */}
      <ScrollSection id="cta" fullViewport bgVariant="gradient" parallax>
        <div className="container mx-auto px-4 w-full">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.2} duration={1.2} scale>
              <Card className="max-w-4xl mx-auto border-2 border-white/30 shadow-2xl bg-background/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-6">
                  <Badge
                    variant="outline"
                    className="w-fit mx-auto border-white/40 text-white bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
                  >
                    Get Started
                  </Badge>
                  <CardTitle className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
                    <span className="text-gradient">
                      {service.ctaTitle || 'Ready to Get Started?'}
                    </span>
                  </CardTitle>
                  {service.ctaDescription && (
                    <CardDescription className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                      {service.ctaDescription}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    asChild
                    size="lg"
                    className="text-base px-8 h-14 bg-logo-blue hover:bg-logo-blue/90"
                  >
                    <Link href="/contact">
                      {service.ctaButtonText || 'Contact Us Today'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </CinematicReveal>
          </ParallaxElement>
        </div>
      </ScrollSection>

      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/services">Services</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{service.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

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

