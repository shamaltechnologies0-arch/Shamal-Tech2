import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LivePreviewListener } from '../../../../components/LivePreviewListener'
import RichText from '../../../../components/RichText'
import { ScrollSection } from '../../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../../components/sections/ParallaxElement'
import { ScrollReveal, StaggerReveal, CinematicReveal } from '../../../../utilities/animations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'

const getPortfolioBySlug = cache(async (slug: string) => {
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
    collection: 'portfolio',
    where,
    limit: 1,
    depth: 2, // Populate relationships like services and images
    draft,
    overrideAccess: draft,
  })

  return result.docs[0] || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const portfolio = await payload.find({
    collection: 'portfolio',
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
  return portfolio.docs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const portfolio = await getPortfolioBySlug(slug)

  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
    }
  }

  return {
    title: portfolio.seo?.title || `${portfolio.title} | Shamal Technologies`,
    description: portfolio.seo?.description || '',
  }
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const portfolio = await getPortfolioBySlug(slug)

  if (!portfolio) {
    notFound()
  }

  return (
    <main className="flex flex-col relative">
      {draft && <LivePreviewListener />}
      
      {/* Hero Section - Full Viewport */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        {portfolio.images &&
          Array.isArray(portfolio.images) &&
          portfolio.images[0] &&
          typeof portfolio.images[0] === 'object' &&
          'url' in portfolio.images[0] && (
            <div className="absolute inset-0 z-0">
              <Image
                src={portfolio.images[0].url as string}
                alt={portfolio.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          )}
        <div className="relative z-10 container mx-auto px-4 py-20 w-full">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.1} duration={1.2}>
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight text-white drop-shadow-lg">
                  {portfolio.title}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 text-white/95">
                  {portfolio.client && (
                    <Badge
                      variant="outline"
                      className="border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5"
                    >
                      Client: {portfolio.client}
                    </Badge>
                  )}
                  {portfolio.sector && (
                    <Badge
                      variant="outline"
                      className="border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5"
                    >
                      Sector: {portfolio.sector}
                    </Badge>
                  )}
                  {portfolio.completionDate && (
                    <Badge
                      variant="outline"
                      className="border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5"
                    >
                      Completed: {new Date(portfolio.completionDate as string).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
            </CinematicReveal>
          </ParallaxElement>
        </div>
      </ScrollSection>

      {/* Description Section */}
      {portfolio.description && (
        <ScrollSection id="description" flexible bgVariant="1" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="max-w-4xl mx-auto prose prose-lg md:prose-xl max-w-none">
                  {typeof portfolio.description === 'object' && 'root' in portfolio.description ? (
                    <RichText data={portfolio.description} enableProse={true} enableGutter={false} />
                  ) : typeof portfolio.description === 'string' ? (
                    <div
                      className="prose prose-lg md:prose-xl max-w-none text-logo-navy"
                      dangerouslySetInnerHTML={{ __html: portfolio.description }}
                    />
                  ) : null}
                </div>
              </CinematicReveal>
            </ParallaxElement>
          </div>
        </ScrollSection>
      )}

      {/* Images Gallery */}
      {portfolio.images && Array.isArray(portfolio.images) && portfolio.images.length > 0 && (
        <ScrollSection id="gallery" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Gallery
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Project Images</span>
                  </h2>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.6}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {portfolio.images.map((image: any, index: number) => {
                  if (typeof image === 'object' && 'url' in image) {
                    return (
                      <div
                        key={index}
                        className="relative h-80 rounded-xl overflow-hidden border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group hover:shadow-2xl transition-all duration-300"
                      >
                        <Image
                          src={image.url as string}
                          alt={`${portfolio.title} - Image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Use Cases Section */}
      {portfolio.useCases && portfolio.useCases.length > 0 && (
        <ScrollSection id="use-cases" flexible bgVariant="1" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Applications
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Use Cases Addressed</span>
                  </h2>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {portfolio.useCases.map((useCase: any, index: number) => (
                  <Card
                    key={index}
                    className="border-2 border-logo-blue/20 shadow-xl bg-background/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                        {useCase.title}
                      </CardTitle>
                    </CardHeader>
                    {useCase.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {useCase.description}
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

      {/* Solutions Delivered Section */}
      {portfolio.solutionsDelivered && portfolio.solutionsDelivered.length > 0 && (
        <ScrollSection id="solutions" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Solutions
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Solutions Delivered</span>
                  </h2>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {portfolio.solutionsDelivered.map((solution: any, index: number) => (
                  <Card
                    key={index}
                    className="border-2 border-logo-blue/20 shadow-xl bg-background/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-display font-bold text-logo-navy">
                        {solution.title}
                      </CardTitle>
                    </CardHeader>
                    {solution.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {solution.description}
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

      {/* Related Services */}
      {portfolio.services && Array.isArray(portfolio.services) && portfolio.services.length > 0 && (
        <ScrollSection id="related-services" flexible bgVariant="1" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Services
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">Related Services</span>
                  </h2>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {portfolio.services.map((service: any) => {
                  if (typeof service === 'object' && 'slug' in service && 'title' in service) {
                    return (
                      <Link key={service.id} href={`/services/${service.slug}`}>
                        <Card className="border-2 border-logo-blue/20 shadow-xl bg-background/95 backdrop-blur-sm hover:shadow-2xl hover:border-logo-blue/50 transition-all duration-300 h-full">
                          <CardHeader>
                            <CardTitle className="text-xl font-display font-bold text-logo-navy group-hover:text-logo-blue transition-colors">
                              {service.title}
                            </CardTitle>
                          </CardHeader>
                          {service.heroDescription && (
                            <CardContent>
                              <CardDescription className="text-base text-logo-blue font-medium mb-4">
                                {service.heroDescription}
                              </CardDescription>
                              <span className="text-logo-navy font-semibold text-sm group-hover:text-logo-blue transition-colors">
                                Learn More →
                              </span>
                            </CardContent>
                          )}
                        </Card>
                      </Link>
                    )
                  }
                  return null
                })}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* CTA Section - Full Viewport */}
      <ScrollSection id="cta" fullViewport bgVariant="gradient" parallax>
        <div className="container mx-auto px-4 w-full">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.2} duration={1.2} scale>
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white drop-shadow-lg">
                  Interested in Similar Projects?
                </h2>
                <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
                  Contact us to discuss how we can help with your project
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-white text-logo-blue hover:bg-white/90 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Contact Us
                </Link>
              </div>
            </CinematicReveal>
          </ParallaxElement>
        </div>
      </ScrollSection>

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex space-x-2 text-sm">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/portfolio" className="text-blue-600 hover:underline">
              Portfolio
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">{portfolio.title}</li>
        </ol>
      </nav>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: portfolio.title,
            description: portfolio.seo?.description || '',
            creator: {
              '@type': 'Organization',
              name: 'Shamal Technologies',
            },
            datePublished: portfolio.completionDate || undefined,
            client: portfolio.client || undefined,
          }),
        }}
      />
    </main>
  )
}

