import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { CinematicReveal } from '../../../utilities/animations'
import { PortfolioClient } from './PortfolioClient'

export const metadata: Metadata = {
  title: 'Our Portfolio | Shamal Technologies',
  description:
    'Explore our successful projects and case studies in drone survey and geospatial solutions across various sectors in Saudi Arabia.',
}

export default async function PortfolioPage() {
  const payload = await getPayload({ config: configPromise })

  // Try to get published portfolio items first
  let portfolio = await payload.find({
    collection: 'portfolio',
    limit: 100,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-featured,-completionDate',
    depth: 1, // Populate relationships like images
  })

  // If no published items, get all items (for development)
  if (portfolio.docs.length === 0) {
    portfolio = await payload.find({
      collection: 'portfolio',
      limit: 100,
      sort: '-featured,-completionDate',
      depth: 1,
    })
  }

  return (
    <main className="flex flex-col relative">
      {/* Hero Section - Full Viewport */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.1} duration={1.2}>
            <div className="container mx-auto px-4 w-full">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge
                  variant="outline"
                  className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
                >
                  Portfolio
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight text-white drop-shadow-lg">
                  Our Portfolio
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
                  Explore our successful projects and case studies across various sectors
                </p>
              </div>
            </div>
          </CinematicReveal>
        </ParallaxElement>
      </ScrollSection>

      {/* Portfolio Grid - Flexible Height */}
      <ScrollSection id="portfolio" flexible bgVariant="1" parallax>
        <div className="container mx-auto px-4 w-full">
          {portfolio.docs.length === 0 ? (
            <CinematicReveal delay={0.2} duration={1}>
              <Card className="max-w-2xl mx-auto border-2 border-logo-blue/30 shadow-xl bg-background/95 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                    No Portfolio Items Available
                  </CardTitle>
                  <CardDescription className="text-base text-logo-blue font-medium">
                    Please check back later.
                  </CardDescription>
                </CardHeader>
              </Card>
            </CinematicReveal>
          ) : (
            <>
              <ParallaxElement speed={0.3} direction="up">
                <CinematicReveal delay={0.2} duration={1.2}>
                  <div className="text-center mb-16 space-y-6">
                    <Badge
                      variant="outline"
                      className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                    >
                      Our Projects
                    </Badge>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
                      <span className="text-gradient">Success Stories</span>
                    </h2>
                  </div>
                </CinematicReveal>
              </ParallaxElement>
              <PortfolioClient items={portfolio.docs} />
            </>
          )}
        </div>
      </ScrollSection>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Our Portfolio',
            description: 'Portfolio of successful projects and case studies',
            itemListElement: portfolio.docs.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'CreativeWork',
                name: item.title,
                description: item.seo?.description || '',
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://shamal.sa'}/portfolio/${item.slug}`,
              },
            })),
          }),
        }}
      />
    </main>
  )
}

