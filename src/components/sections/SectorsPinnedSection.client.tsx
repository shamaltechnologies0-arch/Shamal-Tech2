'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { LocalizedLink as Link } from '../LocalizedLink'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'
import { loadGsap } from '../../lib/animations/loadGsap'

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
  /** When false, sectors render as a normal two-column layout without scroll-pinned animation */
  usePinnedScroll?: boolean
}

const HEADER_OFFSET = '4.5rem'
const DESKTOP_MQ = '(min-width: 1024px)'

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

function canPinDesktop() {
  return (
    window.matchMedia(DESKTOP_MQ).matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
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
  const sectionRef = useRef<HTMLElement>(null)
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const rightColumnWrapperRef = useRef<HTMLDivElement>(null)
  const rightColumnInnerRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)
  const bgImageUrl = backgroundImage?.url

  useEffect(() => {
    if (!usePinnedScroll) return

    const section = sectionRef.current
    const wrapper = rightColumnWrapperRef.current
    const inner = rightColumnInnerRef.current
    if (!section || !wrapper || !inner) return

    let cancelled = false
    let revertPin: (() => void) | null = null
    let lastDistance = -1
    let debounceId: ReturnType<typeof setTimeout> | null = null
    let removeResize: (() => void) | null = null
    let gsapRef: Awaited<ReturnType<typeof loadGsap>>['gsap'] | null = null

    const clearPinBox = () => {
      section.style.removeProperty('height')
      section.style.removeProperty('min-height')
      section.style.removeProperty('overflow')
      section.style.removeProperty('padding-top')
      section.style.removeProperty('padding-bottom')
      wrapper.style.removeProperty('height')
      wrapper.style.removeProperty('overflow')
    }

    const applyPinBox = () => {
      section.style.height = `calc(100dvh - ${HEADER_OFFSET})`
      section.style.minHeight = '600px'
      section.style.overflow = 'hidden'
      section.style.paddingTop = '2.5rem'
      section.style.paddingBottom = '2.5rem'
      wrapper.style.height = '100%'
      wrapper.style.overflow = 'hidden'
    }

    const teardown = () => {
      revertPin?.()
      revertPin = null
      lastDistance = -1
      clearPinBox()
      if (gsapRef) gsapRef.set(inner, { clearProps: 'transform' })
    }

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return
      gsapRef = gsap

      const setup = () => {
        if (cancelled) return

        if (!canPinDesktop()) {
          teardown()
          ScrollTrigger.refresh()
          return
        }

        if (revertPin) {
          const currentDistance = Math.max(0, inner.scrollHeight - wrapper.clientHeight)
          if (Math.abs(currentDistance - lastDistance) < 2) return
        }

        applyPinBox()

        const scrollDistance = Math.max(0, inner.scrollHeight - wrapper.clientHeight)
        if (scrollDistance <= 1) {
          teardown()
          ScrollTrigger.refresh()
          return
        }

        lastDistance = scrollDistance
        revertPin?.()

        try {
          const ctx = gsap.context(() => {
            gsap.to(inner, {
              y: -scrollDistance,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: `top ${HEADER_OFFSET}`,
                end: `+=${scrollDistance}`,
                pin: true,
                pinSpacing: true,
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            })
          }, section)

          revertPin = () => ctx.revert()
          ScrollTrigger.refresh()
        } catch (error) {
          console.error('SectorsPinnedSection: Error initializing ScrollTrigger:', error)
          teardown()
        }
      }

      const scheduleSetup = () => {
        if (debounceId) clearTimeout(debounceId)
        debounceId = setTimeout(setup, 100)
      }

      const waitForLenis = (attempts = 0) => {
        if (cancelled) return
        const w = window as Window & { lenisReady?: boolean; lenis?: unknown }
        if (w.lenisReady || w.lenis || attempts >= 20) {
          setup()
          return
        }
        debounceId = setTimeout(() => waitForLenis(attempts + 1), 100)
      }

      debounceId = setTimeout(() => waitForLenis(), 200)

      window.addEventListener('resize', scheduleSetup)
      removeResize = () => window.removeEventListener('resize', scheduleSetup)

      inner.querySelectorAll('img').forEach((img) => {
        if (!img.complete) img.addEventListener('load', scheduleSetup, { once: true })
      })
    })

    return () => {
      cancelled = true
      if (debounceId) clearTimeout(debounceId)
      removeResize?.()
      teardown()
    }
  }, [sectors, usePinnedScroll])

  return (
    <section ref={sectionRef} className="relative w-full overflow-visible py-16 md:py-24">
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

      <div className="relative z-10 container mx-auto h-full px-4">
        <div className="grid h-full grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div
            ref={leftColumnRef}
            className={
              usePinnedScroll
                ? 'flex items-center self-start lg:sticky lg:top-24 lg:z-10 lg:min-h-[calc(100dvh-8rem)]'
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

          <div ref={rightColumnWrapperRef} className="relative min-h-0">
            <div
              ref={rightColumnInnerRef}
              className="space-y-6"
              style={usePinnedScroll ? { willChange: 'transform' } : undefined}
            >
              {sectors.map((sector, index) => {
                const sectorImage = resolveSectorImage(sector.image)
                const primaryLink = sector.ctaContact || sector.ctaBlog
                const hasLink = Boolean(primaryLink)

                const cardContent = (
                  <Card
                    className={`transition-shadow hover:shadow-lg ${hasLink ? 'cursor-pointer hover:border-primary' : ''}`}
                  >
                    {sectorImage && (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={sectorImage}
                          alt={
                            getLocalizedValue(sector.name, sector.nameAr, language) ||
                            'Sector image'
                          }
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
                                  key={useCase.id || idx}
                                  className="flex items-start text-sm text-muted-foreground"
                                >
                                  <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                  <div>
                                    <div className="font-medium">
                                      {getLocalizedValue(useCase.title, useCase.titleAr, language)}
                                    </div>
                                    {getLocalizedValue(
                                      useCase.description,
                                      useCase.descriptionAr,
                                      language,
                                    ) && (
                                      <div className="mt-0.5 text-xs text-muted-foreground/80">
                                        {getLocalizedValue(
                                          useCase.description,
                                          useCase.descriptionAr,
                                          language,
                                        )}
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
      </div>
    </section>
  )
}
