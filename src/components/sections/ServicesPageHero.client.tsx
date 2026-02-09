'use client'

import { Badge } from '../ui/badge'
import { ParallaxElement } from './ParallaxElement'
import { CinematicReveal } from '../../utilities/animations'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'

interface ServicesPageHeroProps {
  badge?: string
  badgeAr?: string
  title?: string
  titleAr?: string
  subtitle?: string
  subtitleAr?: string
}

export function ServicesPageHero({
  badge = 'Our Services',
  badgeAr,
  title = 'Our Services',
  titleAr,
  subtitle,
  subtitleAr,
}: ServicesPageHeroProps) {
  const { language } = useLanguage()
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displaySubtitle = getLocalizedValue(subtitle, subtitleAr, language)

  return (
    <ParallaxElement speed={0.2} direction="up">
      <CinematicReveal delay={0.1} duration={1.2}>
        <div className="container mx-auto px-4 w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge
              variant="outline"
              className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
            >
              {displayBadge}
            </Badge>
            <h1 className="text-hero font-display font-bold tracking-tight text-white drop-shadow-2xl">
              {displayTitle}
            </h1>
            {displaySubtitle && (
              <p className="text-body-large text-white/95 max-w-3xl mx-auto font-medium drop-shadow-lg">
                {displaySubtitle}
              </p>
            )}
          </div>
        </div>
      </CinematicReveal>
    </ParallaxElement>
  )
}
