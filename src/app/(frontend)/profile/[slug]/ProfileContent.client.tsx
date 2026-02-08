'use client'

import Link from 'next/link'
import { Globe, FileText, ExternalLink, Linkedin, Mail, Phone } from 'lucide-react'

import { ProfilePhotoGradient } from '@/components/ProfilePhotoGradient'
import { useLanguage } from '@/providers/Language/LanguageContext'
import { profileTranslations } from '@/lib/translations/profile'

interface ProfileContentProps {
  employee: {
    fullName: string
    fullNameArabic?: string | null
    position?: string | null
    positionArabic?: string | null
    phoneNumber?: string
    businessEmail?: string
    linkedInUrl?: string | null
    websiteUrl?: string | null
    companyProfileFolderUrl?: string | null
    companyWebsiteUrl?: string | null
  }
  profileImageUrl: string | null
  arabicPdfUrl: string | null
  englishPdfUrl: string | null
  hasFolderLink: boolean
}

export function ProfileContent({
  employee,
  profileImageUrl,
  arabicPdfUrl,
  englishPdfUrl,
  hasFolderLink,
}: ProfileContentProps) {
  const { language } = useLanguage()
  const t = profileTranslations[language]
  const isArabic = language === 'ar'

  // Use Arabic content when available and language is Arabic; email always stays as-is
  const displayName = isArabic && employee.fullNameArabic ? employee.fullNameArabic : employee.fullName
  const displayPosition = isArabic && employee.positionArabic ? employee.positionArabic : employee.position

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 pt-12 sm:pt-16 max-w-lg">
        <article
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          itemScope
          itemType="https://schema.org/Person"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Profile Image */}
          <div className="pt-12 sm:pt-16">
            {profileImageUrl ? (
              <ProfilePhotoGradient
                src={profileImageUrl}
                alt={displayName}
                sizes="(max-width: 400px) 280px, 320px"
              />
            ) : (
              <div className="relative aspect-square max-w-[280px] mx-auto w-full rounded-full bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400 border-4 border-[#0c3254]/30">
                {displayName.charAt(0)}
              </div>
            )}
          </div>

          {/* Name & Position - Email always stays as-is, name/position use Arabic when selected */}
          <div className="px-6 pt-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900" itemProp="name">
              {displayName}
            </h1>
            {displayPosition && (
              <p className="mt-1 text-slate-600 dark:text-slate-400">{displayPosition}</p>
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
                href={employee.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5 flex-shrink-0" />
                <span>{t.linkedInProfile}</span>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            )}

            {employee.websiteUrl && (
              <a
                href={employee.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
              >
                <Globe className="h-5 w-5 flex-shrink-0" />
                <span className="break-all">{t.personalWebsite}</span>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            )}
          </div>

          {/* Company Profile PDFs */}
          <div className="px-6 pb-6 space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              {t.companyProfile}
            </h2>

            {hasFolderLink ? (
              <a
                href={employee.companyProfileFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <FileText className="h-5 w-5" />
                <span>{t.viewCompanyProfile}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (arabicPdfUrl || englishPdfUrl) ? (
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
                    <span>{t.companyProfileArabic}</span>
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
                    <span>{t.companyProfileEnglish}</span>
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
              href={employee.companyWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{t.visitCompanyWebsite}</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
