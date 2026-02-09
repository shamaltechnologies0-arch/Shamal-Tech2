'use client'

import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { CinematicReveal } from '../../utilities/animations'
import { ParallaxElement } from './ParallaxElement'
import { ScrollSection } from './ScrollSection'
import { Badge } from '../ui/badge'
import { AnimatedCounter } from '../ui/AnimatedCounter.client'
import { StaggerReveal } from '../../utilities/animations'

interface Stat {
  value: number
  suffix?: string
  prefix?: string
  label?: string
  labelAr?: string
}

interface ImpactStatsSectionProps {
  badge?: string
  badgeAr?: string
  heading?: string
  headingAr?: string
  stats?: Stat[]
}

const defaultStats: Stat[] = [
  { value: 100, suffix: '+', label: 'Projects Completed', labelAr: 'مشاريع منجزة' },
  { value: 80, suffix: '+', label: 'Expert Team', labelAr: 'فريق خبراء' },
  { value: 11, label: 'Sectors Served', labelAr: 'قطاعات نخدمها' },
  { value: 90, suffix: '%', label: 'Client Satisfaction', labelAr: 'رضا العملاء' },
]

export function ImpactStatsSection({
  badge = 'Our Impact',
  badgeAr,
  heading = 'Delivering Excellence Across Industries',
  headingAr,
  stats = defaultStats,
}: ImpactStatsSectionProps) {
  const { language } = useLanguage()
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayHeading = getLocalizedValue(heading, headingAr, language)

  if (!stats || stats.length === 0) {
    return null
  }

  return (
    <ScrollSection id="stats" fullViewport bgVariant="2" className="border-y border-logo-blue/20 surface-neutral">
      <div className="container mx-auto px-4 w-full">
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.1} duration={1.2} scale>
            <div className="text-center mb-16 space-y-6">
              <Badge
                variant="outline"
                className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
              >
                {displayBadge}
              </Badge>
              <h2 className="text-display-large font-display font-bold text-foreground">
                {displayHeading}
              </h2>
            </div>
          </CinematicReveal>
        </ParallaxElement>
        <StaggerReveal direction="up" delay={0.3} stagger={0.2} duration={1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
            {stats.map((stat, index) => {
              const displayLabel = getLocalizedValue(stat.label, stat.labelAr, language)
              const useGradient = index % 2 === 0
              return (
                <div key={index} className="text-center space-y-4 group">
                  <div
                    className={`text-6xl md:text-7xl lg:text-8xl font-geometric font-bold group-hover:scale-110 transition-transform duration-300 ${
                      useGradient ? 'text-gradient' : 'text-logo-navy'
                    }`}
                  >
                    <AnimatedCounter
                      value={stat.value}
                      duration={2000}
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                    />
                  </div>
                  <div
                    className={`text-base md:text-lg font-semibold ${
                      useGradient ? 'text-logo-navy' : 'text-logo-blue'
                    }`}
                  >
                    {displayLabel}
                  </div>
                </div>
              )
            })}
          </div>
        </StaggerReveal>
      </div>
    </ScrollSection>
  )
}
