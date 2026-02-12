'use client'

import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { getLocalizedValue } from '../../lib/localization'
import { Media } from '../Media'
import { getClientSideURL } from '../../utilities/getURL'

type Certification = {
  id?: string | null
  name?: string | null
  nameAr?: string | null
  description?: string | null
  descriptionAr?: string | null
  image?: {
    id?: string
    url?: string | null
    filename?: string
    alt?: string
    width?: number
    height?: number
    updatedAt?: string
  } | string | null
}

type CertificationsSectionProps = {
  certifications: Certification[]
}

/** Build a displayable media resource from certification image (handles unpopulated or missing url) */
function getCertImageResource(cert: Certification): Certification['image'] {
  const img = cert.image
  if (!img || typeof img !== 'object') return null
  const url = img.url ?? (img.filename ? `${getClientSideURL()}/media/${img.filename}` : null)
  if (!url) return null
  return { ...img, url }
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  if (!certifications?.length) return null

  return (
    <>
      <div className="text-center mb-16 space-y-6">
        <Badge
          variant="outline"
          className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
        >
          {t.recognition}
        </Badge>
        <h2 className="text-display-large font-display font-bold tracking-tight">
          <span className="text-gradient">{t.certifications}</span>
        </h2>
        <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
          {t.certificationsSubtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {certifications.map((cert, index) => {
          const displayName = getLocalizedValue(cert.name, cert.nameAr, language)
          const displayDescription = getLocalizedValue(cert.description, cert.descriptionAr, language)
          const imageResource = getCertImageResource(cert)

          return (
            <Card
              key={cert.id ?? index}
              className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
            >
              <CardHeader>
                {imageResource && (
                  <div className="relative w-full h-40 mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Media
                      resource={imageResource}
                      alt={imageResource.alt ?? displayName ?? 'Certification'}
                      imgClassName="object-contain"
                      pictureClassName="relative block w-full h-full"
                      fill
                    />
                  </div>
                )}
                <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                  {displayName}
                </CardTitle>
              </CardHeader>
              {displayDescription && (
                <CardContent>
                  <CardDescription className="text-base text-logo-blue font-medium">
                    {displayDescription}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </>
  )
}
