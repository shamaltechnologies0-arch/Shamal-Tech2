'use client'

import Image from 'next/image'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { CinematicReveal } from '../../utilities/animations'
import { ParallaxElement } from './ParallaxElement'
import { ScrollSection } from './ScrollSection'
import { Badge } from '../ui/badge'
import { getServiceImagePathBySlug, getServiceImagePath } from '../../utilities/getServiceImage'
import { getCommonTranslations } from '../../lib/translations/common'

interface ServiceHeroSectionProps {
  slug: string
  title?: string | null
  titleAr?: string | null
  heroDescription?: string | null
  heroDescriptionAr?: string | null
  heroImage?: { url?: string } | string | null
}

export function ServiceHeroSection({
  slug,
  title,
  titleAr,
  heroDescription,
  heroDescriptionAr,
  heroImage,
}: ServiceHeroSectionProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(heroDescription, heroDescriptionAr, language)

  const imageSrc = (() => {
    if (heroImage) {
      if (typeof heroImage === 'string') {
        return getServiceImagePathBySlug(slug) || getServiceImagePath(displayTitle || '')
      }
      if (typeof heroImage === 'object' && heroImage?.url) {
        return heroImage.url
      }
    }
    return getServiceImagePathBySlug(slug) || getServiceImagePath(displayTitle || '')
  })()

  return (
    <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={displayTitle || 'Service'}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-20 w-full">
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.1} duration={1.2}>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge
                variant="outline"
                className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
              >
                {t.service}
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight text-white drop-shadow-lg">
                {displayTitle}
              </h1>
              {displayDescription && (
                <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
                  {displayDescription}
                </p>
              )}
            </div>
          </CinematicReveal>
        </ParallaxElement>
      </div>
    </ScrollSection>
  )
}
