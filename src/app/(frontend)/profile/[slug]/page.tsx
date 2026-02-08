import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cache } from 'react'

import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

import { ProfileContent } from './ProfileContent.client'

interface EmployeeProfile {
  id: string
  fullName: string
  fullNameArabic?: string | null
  position?: string | null
  positionArabic?: string | null
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

  const hasFolderLink = employee.companyProfileFolderUrl?.trim()

  return (
    <>
      <ProfileContent
        employee={{
          ...employee,
          linkedInUrl: employee.linkedInUrl ? normalizeExternalUrl(employee.linkedInUrl) : null,
          websiteUrl: employee.websiteUrl ? normalizeExternalUrl(employee.websiteUrl) : null,
          companyProfileFolderUrl: employee.companyProfileFolderUrl ? normalizeExternalUrl(employee.companyProfileFolderUrl) : null,
          companyWebsiteUrl: employee.companyWebsiteUrl ? normalizeExternalUrl(employee.companyWebsiteUrl) : null,
        }}
        profileImageUrl={profileImageUrl}
        arabicPdfUrl={arabicPdfUrl}
        englishPdfUrl={englishPdfUrl}
        hasFolderLink={!!hasFolderLink}
      />

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
    </>
  )
}
