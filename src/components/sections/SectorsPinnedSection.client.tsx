'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { LocalizedLink as Link } from '../LocalizedLink'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'

interface Sector {
  name?: string
  nameAr?: string
  slug?: string
  description?: string
  descriptionAr?: string
  image?: {
    id?: string
    url?: string
    filename?: string
    alt?: string
    mimeType?: string
  } | string | null
  ctaBlog?: string
  ctaContact?: string
  useCases?: Array<{
    title?: string
    titleAr?: string
    description?: string
    descriptionAr?: string
    id?: string
  }>
  solutionsDelivered?: Array<{
    title?: string
    titleAr?: string
    description?: string
    descriptionAr?: string
    id?: string
  }>
}

interface SectorsPinnedSectionProps {
  badge?: string
  badgeAr?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  sectors: Sector[]
  backgroundImage?: {
    url?: string
    alt?: string
  } | null
  /** When true, the title stays sticky on large screens while sector cards scroll with the page */
  usePinnedScroll?: boolean
}

function resolveSectorImage(image: Sector['image']): string | null {
  if (!image) return null
  if (typeof image !== 'object' || image === null) return null

  if ('url' in image && image.url) {
    if (image.url.startsWith('http') || image.url.startsWith('/')) return image.url
    return `/${image.url}`
  }

  if ('filename' in image && image.filename) {
    return `/media/${image.filename}`
  }

  return null
}

export function SectorsPinnedSection({
  badge = 'Industries',
  badgeAr,
  title = 'SECTORS WE SERVE',
  titleAr,
  description,
  descriptionAr,
  sectors,
  backgroundImage,
  usePinnedScroll = true,
}: SectorsPinnedSectionProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)
  const bgImageUrl = backgroundImage?.url

  return (
    <section className="relative w-full overflow-x-hidden py-16 md:py-24">
      {bgImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImageUrl}
            alt={backgroundImage.alt || 'Sectors background'}
            fill
            className="object-cover"
            style={{ opacity: 0.3 }}
            priority={false}
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div
            className={
              usePinnedScroll
                ? 'flex flex-col justify-center space-y-6 lg:sticky lg:top-28 lg:self-start'
                : 'flex flex-col justify-center space-y-6'
            }
          >
            <div className="w-full space-y-6">
              <Badge variant="secondary" className="mb-4">
                {displayBadge}
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {displayTitle}
              </h2>
              {displayDescription && (
                <p className="max-w-lg text-xl leading-relaxed text-muted-foreground">
                  {displayDescription}
                </p>
              )}
            </div>
          </div>

          <div className="relative space-y-6">
            {sectors.map((sector, index) => {
              const sectorImage = resolveSectorImage(sector.image)
              const primaryLink = sector.ctaContact || sector.ctaBlog
              const hasLink = Boolean(primaryLink)

              const cardContent = (
                <Card className={`transition-shadow hover:shadow-lg ${hasLink ? 'cursor-pointer hover:border-primary' : ''}`}>
                  {sectorImage && (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={sectorImage}
                        alt={getLocalizedValue(sector.name, sector.nameAr, language) || 'Sector image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {getLocalizedValue(sector.name, sector.nameAr, language)}
                    </CardTitle>
                  </CardHeader>
                  {getLocalizedValue(sector.description, sector.descriptionAr, language) && (
                    <CardContent>
                      <CardDescription className="mb-4">
                        {getLocalizedValue(sector.description, sector.descriptionAr, language)}
                      </CardDescription>
                      {sector.useCases && sector.useCases.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <h4 className="text-sm font-semibold">{t.keyApplications}</h4>
                          <ul className="space-y-1">
                            {sector.useCases.slice(0, 3).map((useCase, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm text-muted-foreground"
                              >
                                <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                <div>
                                  <div className="font-medium">
                                    {getLocalizedValue(useCase.title, useCase.titleAr, language)}
                                  </div>
                                  {getLocalizedValue(useCase.description, useCase.descriptionAr, language) && (
                                    <div className="mt-0.5 text-xs text-muted-foreground/80">
                                      {getLocalizedValue(useCase.description, useCase.descriptionAr, language)}
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(sector.ctaBlog || sector.ctaContact) && (
                        <div
                          className="flex flex-wrap gap-2 border-t pt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {sector.ctaBlog && (
                            <Button asChild variant="outline" size="sm" className="text-xs">
                              <Link href={sector.ctaBlog}>
                                {t.nav.blogs}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                          {sector.ctaContact && (
                            <Button asChild variant="outline" size="sm" className="text-xs">
                              <Link href={sector.ctaContact}>
                                {t.contactUs}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              )

              return (
                <div key={sector.slug || index} className="sector-item">
                  {hasLink ? (
                    <Link href={primaryLink as string} className="block">
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
