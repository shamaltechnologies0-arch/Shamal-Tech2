'use client'

import Image from 'next/image'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import RichText from '../RichText'

interface VisionMissionCardProps {
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  content?: string | any
  contentAr?: string | any
  image?: {
    url?: string
    filename?: string
    alt?: string
  } | null
  defaultTitle: string
  icon: React.ReactNode
  gradientClass: string
  borderClass: string
  iconBgClass: string
}

export function VisionMissionCard({
  title,
  titleAr,
  description,
  descriptionAr,
  content,
  contentAr,
  image,
  defaultTitle,
  icon,
  gradientClass,
  borderClass,
  iconBgClass,
}: VisionMissionCardProps) {
  const { language } = useLanguage()
  const displayTitle = getLocalizedValue(title, titleAr, language)
  // For description/content: prefer description, fallback to content. Use Ar version when Arabic selected.
  const resolvedText =
    language === 'ar' && (descriptionAr ?? contentAr)
      ? (descriptionAr ?? contentAr)
      : (description ?? content)

  return (
    <Card className={`border-2 shadow-xl h-full bg-background/95 backdrop-blur-sm ${borderClass}`}>
      <CardHeader>
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-xl ${iconBgClass}`}>{icon}</div>
          <CardTitle className="text-3xl md:text-4xl font-display font-bold">
            <span className={gradientClass}>{displayTitle || defaultTitle}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {image &&
          typeof image === 'object' &&
          image !== null &&
          (image.url || image.filename) && (
            <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
              <Image
                src={
                  image.url
                    ? image.url.startsWith('http')
                      ? image.url
                      : image.url.startsWith('/')
                        ? image.url
                        : `/${image.url}`
                    : image.filename
                      ? `/media/${image.filename}`
                      : ''
                }
                alt={image.alt || displayTitle || 'Section image'}
                fill
                className="object-cover"
                priority={false}
                quality={90}
              />
            </div>
          )}
        <div className="prose prose-lg md:prose-xl max-w-none text-logo-navy">
          {resolvedText ? (
            typeof resolvedText === 'string' ? (
              <p className="whitespace-pre-wrap leading-relaxed font-medium">{resolvedText}</p>
            ) : (
              <RichText data={resolvedText} enableGutter={false} />
            )
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
