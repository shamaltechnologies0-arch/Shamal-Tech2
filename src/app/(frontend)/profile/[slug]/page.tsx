import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'

import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

import { Mail, Phone, Linkedin, Globe, FileText, ExternalLink } from 'lucide-react'

interface EmployeeProfile {
  id: string
  fullName: string
  position?: string | null
  profileImage?: { url?: string; alt?: string } | string | null
  phoneNumber?: string
  businessEmail?: string
  linkedInUrl?: string | null
  websiteUrl?: string | null
  companyProfileArabic?: { url?: string; filename?: string } | string | null
  companyProfileEnglish?: { url?: string; filename?: string } | string | null
  companyProfileFolderUrl?: string | null
  companyWebsiteUrl?: string | null
}

// Force dynamic rendering so profiles work for employees added after build/deploy
export const dynamic = 'force-dynamic'

const getEmployeeBySlug = cache(async (slug: string): Promise<EmployeeProfile | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'employees',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
    overrideAccess: true, // Public profile page - we explicitly filter published only
  })

  return (result.docs[0] as EmployeeProfile | undefined) || null
})

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const employees = await payload.find({
      collection: 'employees',
      where: { status: { equals: 'published' } },
      limit: 500,
      select: { slug: true },
    })
    return employees.docs.map((emp) => ({ slug: (emp as { slug: string }).slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const employee = await getEmployeeBySlug(slug)

  if (!employee) {
    return { title: 'Profile Not Found' }
  }

  const profileImageUrl =
    employee.profileImage && typeof employee.profileImage === 'object' && 'url' in employee.profileImage
      ? employee.profileImage.url
      : null

  return {
    title: `${employee.fullName} | Employee Profile`,
    description: `Digital business card for ${employee.fullName}. Contact: ${employee.businessEmail || employee.phoneNumber || ''}`,
    openGraph: {
      title: `${employee.fullName} | Employee Profile`,
      description: `Digital business card for ${employee.fullName}`,
      images: profileImageUrl ? [profileImageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

function getMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${getServerSideURL()}${url}`
}

function normalizeExternalUrl(url: string | null | undefined): string {
  if (!url?.trim()) return ''
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const employee = await getEmployeeBySlug(slug)

  if (!employee) {
    notFound()
  }

  const profileImageUrl =
    employee.profileImage && typeof employee.profileImage === 'object' && 'url' in employee.profileImage
      ? getMediaUrl(employee.profileImage.url)
      : null

  const arabicPdfUrl =
    employee.companyProfileArabic && typeof employee.companyProfileArabic === 'object' && 'url' in employee.companyProfileArabic
      ? getMediaUrl(employee.companyProfileArabic.url)
      : null

  const englishPdfUrl =
    employee.companyProfileEnglish && typeof employee.companyProfileEnglish === 'object' && 'url' in employee.companyProfileEnglish
      ? getMediaUrl(employee.companyProfileEnglish.url)
      : null

  const hasIndividualPdfs = arabicPdfUrl || englishPdfUrl
  const hasFolderLink = employee.companyProfileFolderUrl?.trim()

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Mobile-optimized, read-only profile */}
      <div className="container mx-auto px-4 py-8 pt-12 sm:pt-16 max-w-lg">
        {/* Profile Card */}
        <article
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          itemScope
          itemType="https://schema.org/Person"
        >
          {/* Profile Image */}
          <div className="relative aspect-square max-w-[280px] mx-auto pt-12 sm:pt-16">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={employee.fullName}
                fill
                className="object-cover rounded-full"
                sizes="(max-width: 400px) 280px, 320px"
                priority
              />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400">
                {employee.fullName.charAt(0)}
              </div>
            )}
          </div>

          {/* Name & Position */}
          <div className="px-6 pt-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900" itemProp="name">
              {employee.fullName}
            </h1>
            {employee.position && (
              <p className="mt-1 text-slate-600 dark:text-slate-400">{employee.position}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="px-6 py-6 space-y-4">
            {employee.phoneNumber && (
              <a
                href={`tel:${employee.phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
                itemProp="telephone"
              >
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>{employee.phoneNumber}</span>
              </a>
            )}

            {employee.businessEmail && (
              <a
                href={`mailto:${employee.businessEmail}`}
                className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
                itemProp="email"
              >
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="break-all">{employee.businessEmail}</span>
              </a>
            )}

            {employee.linkedInUrl && (
              <a
                href={normalizeExternalUrl(employee.linkedInUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5 flex-shrink-0" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            )}

            {employee.websiteUrl && (
              <a
                href={normalizeExternalUrl(employee.websiteUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
              >
                <Globe className="h-5 w-5 flex-shrink-0" />
                <span className="break-all">Personal Website</span>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            )}
          </div>

          {/* Company Profile PDFs */}
          <div className="px-6 pb-6 space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Company Profile
            </h2>

            {hasFolderLink ? (
              <a
                href={normalizeExternalUrl(employee.companyProfileFolderUrl)!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <FileText className="h-5 w-5" />
                <span>View Company Profile (Arabic & English)</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : hasIndividualPdfs ? (
              <div className="flex flex-col sm:flex-row gap-3">
                {arabicPdfUrl && (
                  <a
                    href={arabicPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-center gap-2 flex-1 py-3 px-4 bg-slate-100 text-slate-800 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Company Profile (Arabic)</span>
                  </a>
                )}
                {englishPdfUrl && (
                  <a
                    href={englishPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-center gap-2 flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Company Profile (English)</span>
                  </a>
                )}
              </div>
            ) : null}
          </div>
        </article>

        {/* Company Website - Bottom */}
        {employee.companyWebsiteUrl && (
          <div className="mt-8 text-center">
            <Link
              href={normalizeExternalUrl(employee.companyWebsiteUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>Visit Company Website</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: employee.fullName,
            email: employee.businessEmail || undefined,
            telephone: employee.phoneNumber || undefined,
            url: employee.websiteUrl || undefined,
            sameAs: employee.linkedInUrl ? [employee.linkedInUrl] : undefined,
            image: profileImageUrl || undefined,
          }),
        }}
      />
    </main>
  )
}
