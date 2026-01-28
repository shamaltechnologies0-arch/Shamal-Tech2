import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { ArrowRight, MapPin, Calendar } from 'lucide-react'
import type { Career } from '../../../payload-types'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import { LivePreviewListener } from '../../../components/LivePreviewListener'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function CareersPage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  // Fetch careers page content from global
  const careersPageContent = (await getCachedGlobal('careers-page-content', 2)()) as {
    hero?: {
      title?: string
      description?: string
      backgroundImage?:
        | {
            url?: string
            alt?: string
          }
        | string
        | null
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

  // Fetch published careers
  const careers = await payload.find({
    collection: 'career',
    limit: 100,
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
    depth: 2, // Populate relationships like featuredImage
    overrideAccess: false,
    draft: false,
  })

  const heroTitle = careersPageContent?.hero?.title || 'Careers'
  const heroDescription =
    careersPageContent?.hero?.description ||
    'Join our team and help shape the future of drone and geospatial solutions in Saudi Arabia'
  const heroBackgroundImage = careersPageContent?.hero?.backgroundImage

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

  return (
    <main className="flex flex-col">
      {draft && <LivePreviewListener />}
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden py-12 md:py-16">
        {heroBackgroundImageSrc ? (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={heroBackgroundImageSrc}
                alt={heroBackgroundImage.alt || 'Careers hero background'}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-background/80" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        )}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="mb-4 text-sm">
              Join Our Team
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            {heroDescription && (
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {heroDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Careers List */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {careers.docs.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>No Open Positions</CardTitle>
                <CardDescription>
                  We currently don&apos;t have any open positions, but we&apos;re always interested in hearing from talented individuals. Please check back later or contact us directly.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.docs.map((career) => (
                <Card
                  key={career.id}
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden flex flex-col"
                >
                  <Link href={`/careers/${career.slug}`} className="block flex flex-col flex-1">
                    {career.featuredImage &&
                      typeof career.featuredImage === 'object' &&
                      'url' in career.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={career.featuredImage.url as string}
                            alt={career.title || 'Career image'}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        </div>
                      )}
                    <CardHeader className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {career.department && (
                          <Badge variant="secondary" className="text-xs">
                            {career.department}
                          </Badge>
                        )}
                        {career.employmentType && (
                          <Badge variant="outline" className="text-xs">
                            {career.employmentType}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {career.title}
                      </CardTitle>
                      <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
                        {career.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{career.location}</span>
                          </div>
                        )}
                        {career.applicationDeadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Deadline:{' '}
                              {new Date(career.applicationDeadline as string).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-primary text-sm font-medium">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2">
            <CardHeader className="text-center space-y-4">
              <Badge variant="default" className="w-fit mx-auto">
                Join Us
              </Badge>
              <CardTitle className="text-4xl md:text-5xl">
                Don&apos;t See a Role That Fits?
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                We&apos;re always looking for talented individuals. Send us your resume and we&apos;ll keep you in mind for future opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Careers at Shamal Technologies',
            description: careersPageContent?.seo?.metaDescription || 'Open job positions at Shamal Technologies',
            itemListElement: careers.docs.map((career, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'JobPosting',
                title: career.title,
                description: career.seo?.description || '', // Use SEO description (string) instead of rich text description
                jobLocation: {
                  '@type': 'Place',
                  address: career.location || 'Saudi Arabia',
                },
                employmentType: career.employmentType || '',
                datePosted: career.createdAt,
                validThrough: career.applicationDeadline || undefined,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://shamal.sa'}/careers/${career.slug}`,
              },
            })),
          }),
        }}
      />
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const careersPageContent = (await getCachedGlobal('careers-page-content', 2)()) as {
    seo?: {
      metaTitle?: string
      metaDescription?: string
      ogImage?: {
        url?: string
        alt?: string
      } | null
    }
  } | null

  const metaTitle = careersPageContent?.seo?.metaTitle || 'Careers | Shamal Technologies'
  const metaDescription = careersPageContent?.seo?.metaDescription || 'Join our team and help shape the future of drone and geospatial solutions in Saudi Arabia.'

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: careersPageContent?.seo?.ogImage?.url
        ? [
            {
              url: careersPageContent.seo.ogImage.url,
              alt: careersPageContent.seo.ogImage.alt || metaTitle,
            },
          ]
        : undefined,
    },
  }
}

