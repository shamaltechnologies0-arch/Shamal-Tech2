'use client'

import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { Badge } from '../ui/badge'

interface AboutHeroSectionProps {
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  badge?: string
  badgeAr?: string
}

export function AboutHeroSection({
  title = 'About Shamal Technologies',
  titleAr,
  description,
  descriptionAr,
  badge = 'Our Story',
  badgeAr,
}: AboutHeroSectionProps) {
  const { language } = useLanguage()
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)

  return (
    <div className="relative z-10 container mx-auto px-4 py-20 w-full">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <Badge variant="outline" className="mb-4 text-sm border-white/40 text-white bg-white/20 backdrop-blur-sm">
          {displayBadge}
        </Badge>
        <h1 className="text-hero font-display font-bold tracking-tight text-white drop-shadow-2xl">
          {displayTitle}
        </h1>
        {displayDescription && (
          <p className="text-body-large text-white/95 max-w-3xl mx-auto drop-shadow-lg font-medium">
            {displayDescription}
          </p>
        )}
      </div>
    </div>
  )
}
