'use client'

import Image from 'next/image'
import { LocalizedLink as Link } from '../LocalizedLink'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { CinematicReveal } from '../../utilities/animations'
import { ParallaxElement } from './ParallaxElement'
import { ScrollSection } from './ScrollSection'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ArrowRight } from 'lucide-react'

interface ContactCTASectionProps {
  badge?: string
  badgeAr?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  primaryCtaText?: string
  primaryCtaTextAr?: string
  secondaryCtaText?: string
  secondaryCtaTextAr?: string
  backgroundImage?: {
    url?: string
    alt?: string
  } | null
  /** Shorter band for blog posts. The homepage keeps the full-screen height. */
  compact?: boolean
}

export function ContactCTASection({
  badge = 'Get In Touch',
  badgeAr,
  title = 'Ready to Get Started?',
  titleAr,
  description,
  descriptionAr,
  primaryCtaText = 'Contact Us Today',
  primaryCtaTextAr,
  secondaryCtaText = 'Explore Services',
  secondaryCtaTextAr,
  backgroundImage,
  compact = false,
}: ContactCTASectionProps) {
  const { language } = useLanguage()
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)
  const displayPrimaryCta = getLocalizedValue(primaryCtaText, primaryCtaTextAr, language)
  const displaySecondaryCta = getLocalizedValue(secondaryCtaText, secondaryCtaTextAr, language)
  const isRtl = language === 'ar'

  return (
    <ScrollSection
      id={compact ? 'blog-cta' : 'contact'}
      fullViewport={!compact}
      bgVariant="gradient"
      parallax={!compact}
      className={compact ? 'py-10 md:py-14' : undefined}
    >
      {backgroundImage?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || 'Contact CTA background'}
            fill
            className="object-cover opacity-20"
            priority={false}
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-logo-blue/20 via-logo-navy/10 to-background/80" />
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10 w-full">
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.2} duration={1.2} scale>
            <Card className="max-w-4xl mx-auto border-2 border-logo-blue/30 shadow-2xl bg-background/95 backdrop-blur-sm">
              <CardHeader className={compact ? 'space-y-3 pb-2 text-center' : 'space-y-6 text-center'}>
                <Badge
                  variant="outline"
                  className="w-fit mx-auto border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                >
                  {displayBadge}
                </Badge>
                <CardTitle
                  className={
                    compact
                      ? 'font-display text-3xl font-bold text-foreground md:text-4xl'
                      : 'text-display-large font-display font-bold text-foreground'
                  }
                >
                  <span className="text-gradient">{displayTitle}</span>
                </CardTitle>
                {displayDescription && (
                  <CardDescription className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    {displayDescription}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className={compact ? 'space-y-0 pt-2 text-center' : 'space-y-6 text-center'}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className={`bg-logo-blue px-8 text-base hover:bg-logo-blue/90 ${compact ? 'h-12' : 'h-14'}`}
                  >
                    <Link href="/contact">
                      {displayPrimaryCta}
                      <ArrowRight
                        className={isRtl ? 'mr-2 h-4 w-4 rotate-180' : 'ml-2 h-4 w-4'}
                      />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className={`border-2 border-logo-navy px-8 text-base text-logo-navy hover:bg-logo-navy hover:text-white ${compact ? 'h-12' : 'h-14'}`}
                  >
                    <Link href="/services">{displaySecondaryCta}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CinematicReveal>
        </ParallaxElement>
      </div>
    </ScrollSection>
  )
}
