'use client'

import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { getLocalizedValue } from '../../lib/localization'

/** Certifications with pre-resolved imageUrl from server (guarantees logos display). */
type CertificationWithImageUrl = {
  id?: string | null
  name?: string | null
  nameAr?: string | null
  description?: string | null
  descriptionAr?: string | null
  imageUrl: string | null
  imageAlt: string
}

type CertificationsSectionProps = {
  certifications: CertificationWithImageUrl[]
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

          return (
            <Card
              key={cert.id ?? index}
              className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
            >
              <CardHeader>
                {cert.imageUrl && (
                  <div className="relative w-full h-40 mb-6 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {/* Plain img so logos always display (avoids Next/Image optimization and serialization issues) */}
                    <img
                      src={cert.imageUrl}
                      alt={cert.imageAlt || displayName || 'Certification'}
                      className="max-h-full w-auto object-contain"
                      width={350}
                      height={140}
                      loading="lazy"
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
