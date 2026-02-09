'use client'

import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { ParallaxElement } from './ParallaxElement'
import { CinematicReveal, StaggerReveal } from '../../utilities/animations'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'

interface ClientsSectionProps {
  badge?: string
  badgeAr?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  clients: Array<{
    logo?:
      | {
          id?: string
          url?: string
          filename?: string
          alt?: string
        }
      | string
      | null
  }>
}

export function ClientsSection({
  badge = 'Partners',
  badgeAr,
  title = 'Our Clients',
  titleAr,
  description = 'Trusted by leading organizations',
  descriptionAr,
  clients,
}: ClientsSectionProps) {
  const { language } = useLanguage()
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)

  return (
    <>
      <ParallaxElement speed={0.3} direction="up">
        <CinematicReveal delay={0.2} duration={1.2}>
          <div className="text-center mb-16 space-y-6">
            <Badge
              variant="outline"
              className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
            >
              {displayBadge}
            </Badge>
            <h2 className="text-display-large font-display font-bold tracking-tight">
              <span className="text-gradient">{displayTitle}</span>
            </h2>
            {displayDescription && (
              <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                {displayDescription}
              </p>
            )}
          </div>
        </CinematicReveal>
      </ParallaxElement>
      <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.6}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-7xl mx-auto">
          {clients.map((client, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-xl transition-all duration-300 border-2 border-logo-blue/10 bg-background/95 backdrop-blur-sm group"
            >
              {client.logo &&
                typeof client.logo === 'object' &&
                client.logo !== null &&
                (client.logo.url || client.logo.filename) && (
                  <div className="relative h-28 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={
                        client.logo.url ||
                        (client.logo.filename ? `/media/${client.logo.filename}` : '')
                      }
                      alt={client.logo.alt || 'Client logo'}
                      fill
                      className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                )}
            </Card>
          ))}
        </div>
      </StaggerReveal>
    </>
  )
}
