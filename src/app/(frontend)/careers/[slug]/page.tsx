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
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { MapPin, Calendar, Mail, ExternalLink, CheckCircle2 } from 'lucide-react'
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
    <main>
      {draft && <LivePreviewListener />}
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        {career.featuredImage &&
          typeof career.featuredImage === 'object' &&
          'url' in career.featuredImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={career.featuredImage.url as string}
                alt={career.title || 'Career image'}
                fill
                className="object-cover opacity-30"
                priority
              />
            </div>
          )}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {career.department && (
              <Badge variant="secondary" className="text-sm">
                {career.department}
              </Badge>
            )}
            {career.employmentType && (
              <Badge variant="outline" className="text-sm">
                {career.employmentType}
              </Badge>
            )}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{career.title}</h1>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            {career.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{career.location}</span>
              </div>
            )}
            {career.applicationDeadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  Apply by:{' '}
                  {new Date(career.applicationDeadline as string).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Job Details Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Job Description */}
                {career.description && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Job Description</h2>
                    <div className="prose prose-lg max-w-none">
                      {typeof career.description === 'object' && 'root' in career.description ? (
                        <RichText data={career.description} enableProse={true} enableGutter={false} />
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: career.description as string }} />
                      )}
                    </div>
                  </div>
                )}

                {/* Key Responsibilities */}
                {career.responsibilities && Array.isArray(career.responsibilities) && career.responsibilities.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Key Responsibilities</h2>
                    <ul className="space-y-3">
                      {career.responsibilities.map((item, index) => (
                        <li key={item.id || index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item.responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Required Qualifications */}
                {career.qualifications && Array.isArray(career.qualifications) && career.qualifications.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Required Qualifications</h2>
                    <ul className="space-y-3">
                      {career.qualifications.map((item, index) => (
                        <li key={item.id || index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item.qualification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {career.requirements && Array.isArray(career.requirements) && career.requirements.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Requirements</h2>
                    <ul className="space-y-3">
                      {career.requirements.map((item, index) => (
                        <li key={item.id || index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item.requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Apply Now</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {career.salaryRange && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Salary Range</p>
                        <p className="font-semibold">{career.salaryRange}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Employment Type</p>
                      <p className="font-semibold capitalize">{career.employmentType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-semibold">{career.location || 'N/A'}</p>
                    </div>
                    {career.applicationUrl ? (
                      <Button asChild className="w-full" size="lg">
                        <Link href={career.applicationUrl} target="_blank" rel="noopener noreferrer">
                          Apply Online
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : career.applicationEmail ? (
                      <Button asChild className="w-full" size="lg">
                        <Link href={`mailto:${career.applicationEmail}?subject=Application for ${career.title}`}>
                          Apply via Email
                          <Mail className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : null}
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/careers">View All Positions</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <Link href="/careers" className="text-blue-600 hover:underline">
              Careers
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">{career.title}</li>
        </ol>
      </nav>

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
    </main>
  )
}

