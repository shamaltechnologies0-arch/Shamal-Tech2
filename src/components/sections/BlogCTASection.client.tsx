'use client'

import { LocalizedLink as Link } from '../LocalizedLink'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { ParallaxElement } from './ParallaxElement'
import { CinematicReveal } from '../../utilities/animations'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'

export type BlogCTAContent = {
  badge?: string | null
  badgeAr?: string | null
  title?: string | null
  titleAr?: string | null
  description?: string | null
  descriptionAr?: string | null
  buttonLabel?: string | null
  buttonLabelAr?: string | null
  buttonHref?: string | null
}

const DEFAULTS = {
  badge: 'Work With Us',
  badgeAr: 'اعمل معنا',
  title: 'Plan a Compliant Drone Survey',
  titleAr: 'خطّط لمسح جوي متوافق مع الأنظمة',
  description:
    'Shamal Technologies supports construction, engineering, and mining teams with GACA-aligned aerial mapping, LiDAR, and geospatial data across Saudi Arabia.',
  descriptionAr:
    'تدعم شمل للتقنيات فرق الإنشاءات والهندسة والتعدين بالمسح الجوي وخرائط الليدار والبيانات الجيومكانية المتوافقة مع متطلبات الهيئة العامة للطيران المدني في المملكة العربية السعودية.',
  buttonLabel: 'Talk to Our Team',
  buttonLabelAr: 'تواصل مع فريقنا',
  buttonHref: '/contact',
}

/**
 * Shared call to action rendered on every blog post.
 * Copy comes from the Blog Posts page global so one CMS edit updates every article.
 */
export function BlogCTASection(content: BlogCTAContent) {
  const { language } = useLanguage()
  const badge = getLocalizedValue(content.badge || DEFAULTS.badge, content.badgeAr || DEFAULTS.badgeAr, language)
  const title = getLocalizedValue(content.title || DEFAULTS.title, content.titleAr || DEFAULTS.titleAr, language)
  const description = getLocalizedValue(
    content.description || DEFAULTS.description,
    content.descriptionAr || DEFAULTS.descriptionAr,
    language,
  )
  const buttonLabel = getLocalizedValue(
    content.buttonLabel || DEFAULTS.buttonLabel,
    content.buttonLabelAr || DEFAULTS.buttonLabelAr,
    language,
  )
  const href = content.buttonHref?.trim() || DEFAULTS.buttonHref

  return (
    <section id="blog-cta" aria-label={badge || undefined} className="container mx-auto w-full px-4 py-16">
      <ParallaxElement speed={0.15} direction="up">
        <CinematicReveal delay={0.1} duration={1} scale>
          <Card className="mx-auto max-w-4xl border-2 border-white/30 bg-background/95 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-6 text-center">
              <Badge
                variant="outline"
                className="mx-auto w-fit border-logo-blue/60 bg-white/90 px-4 py-1.5 text-sm font-semibold text-logo-blue shadow-md backdrop-blur-sm"
              >
                {badge}
              </Badge>
              <CardTitle className="font-display text-display-large font-bold text-foreground">
                <span className="text-gradient">{title}</span>
              </CardTitle>
              <CardDescription className="mx-auto max-w-3xl text-body-large font-medium text-logo-navy">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg" className="h-14 bg-logo-blue px-8 text-base hover:bg-logo-blue/90">
                <Link href={href}>
                  {buttonLabel}
                  <ArrowRight className={language === 'ar' ? 'mr-2 h-4 w-4' : 'ml-2 h-4 w-4'} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </CinematicReveal>
      </ParallaxElement>
    </section>
  )
}
