'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined' && gsap && ScrollTrigger) {
  try {
    gsap.registerPlugin(ScrollTrigger)
  } catch (e) {
    console.warn('ScrollTrigger registration warning:', e)
  }
}

interface Sector {
  name?: string
  slug?: string
  description?: string
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
    description?: string
    id?: string
  }>
  solutionsDelivered?: Array<{
    title?: string
    description?: string
    id?: string
  }>
}

interface SectorsPinnedSectionProps {
  title?: string
  description?: string
  sectors: Sector[]
  backgroundImage?: {
    url?: string
    alt?: string
  } | null
}

export function SectorsPinnedSection({
  title = 'SECTORS WE SERVE',
  description,
  sectors,
  backgroundImage,
}: SectorsPinnedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const rightColumnWrapperRef = useRef<HTMLDivElement>(null)
  const rightColumnInnerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (
      !sectionRef.current ||
      !leftColumnRef.current ||
      !rightColumnWrapperRef.current ||
      !rightColumnInnerRef.current
    )
      return
    if (isInitializedRef.current) return

    if (typeof window === 'undefined') return
    if (!gsap || !ScrollTrigger) return

    try {
      gsap.registerPlugin(ScrollTrigger)
    } catch (e) {
      // Plugin already registered
    }

    const section = sectionRef.current
    const leftColumn = leftColumnRef.current
    const rightColumnWrapper = rightColumnWrapperRef.current
    const rightColumnInner = rightColumnInnerRef.current

    let pinTrigger: ScrollTrigger | null = null
    let scrollAnimation: gsap.core.Tween | null = null
    let handleResize: (() => void) | null = null
    let timeoutId: NodeJS.Timeout | null = null

    const initScrollTrigger = () => {
      if (isInitializedRef.current) return

      if (!section || !leftColumn || !rightColumnWrapper || !rightColumnInner) {
        console.warn('SectorsPinnedSection: Elements not available')
        return
      }

      if (!ScrollTrigger || typeof ScrollTrigger.create !== 'function') {
        console.error('SectorsPinnedSection: ScrollTrigger not loaded')
        return
      }

      try {
        // Wait for layout to stabilize, then calculate dimensions
        const initAnimation = () => {
          if (isInitializedRef.current) return

          const wrapperHeight = rightColumnWrapper.offsetHeight
          const innerHeight = rightColumnInner.scrollHeight
          const scrollDistance = Math.max(0, innerHeight - wrapperHeight)

          // Only proceed if there's content to scroll
          if (scrollDistance <= 0) {
            return
          }

          // Kill any existing ScrollTriggers for this section
          ScrollTrigger.getAll().forEach((trigger) => {
            try {
              if (trigger.vars.trigger === section) {
                trigger.kill()
              }
            } catch (e) {
              // Ignore cleanup errors
            }
          })

          // Pin the entire section
          // Pin duration equals the scroll distance needed to scroll through all content
          const pinDuration = scrollDistance

          pinTrigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: `+=${pinDuration}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false,
          })

          // Animate the inner wrapper based on scroll progress
          // As we scroll, translate the inner wrapper upward
          // This creates the effect of scrolling through the cards
          scrollAnimation = gsap.to(rightColumnInner, {
            y: -scrollDistance,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${pinDuration}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })

          // Mark as initialized
          isInitializedRef.current = true

          // Refresh ScrollTrigger after animations are set up
          ScrollTrigger.refresh()
        }

        // Wait for layout to stabilize
        requestAnimationFrame(() => {
          requestAnimationFrame(initAnimation)
        })

      } catch (error) {
        console.error('SectorsPinnedSection: Error initializing ScrollTrigger:', error)
      }
    }

    // Wait for DOM and Lenis to be ready
    const attemptInit = () => {
      const lenisReady = (window as any).lenisReady
      const lenisInstance = (window as any).lenis
      const isScrollTriggerReady =
        ScrollTrigger && typeof ScrollTrigger.create === 'function'

      if (isScrollTriggerReady && (lenisReady || lenisInstance)) {
        initScrollTrigger()
      } else {
        const attempts = (attemptInit as any).attempts || 0
        if (attempts < 15) {
          ;(attemptInit as any).attempts = attempts + 1
          timeoutId = setTimeout(attemptInit, 100)
        } else {
          console.warn('Initializing ScrollTrigger without Lenis')
          initScrollTrigger()
        }
      }
    }

    timeoutId = setTimeout(attemptInit, 500)

    // Refresh ScrollTrigger on window resize
    handleResize = () => {
      if (ScrollTrigger) {
        ScrollTrigger.refresh()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      isInitializedRef.current = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (pinTrigger) {
        try {
          pinTrigger.kill()
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      if (scrollAnimation) {
        try {
          scrollAnimation.kill()
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      if (handleResize) {
        window.removeEventListener('resize', handleResize)
      }
      if (ScrollTrigger && ScrollTrigger.getAll) {
        try {
          ScrollTrigger.getAll().forEach((trigger) => {
            try {
              if (trigger.vars.trigger === section) {
                trigger.kill()
              }
            } catch (e) {
              // Ignore cleanup errors
            }
          })
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [sectors])

  const bgImageUrl = backgroundImage?.url

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '80vh', minHeight: '600px' }}
    >
      {/* Background Image - Fixed, never stretches */}
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

      {/* Content Container */}
      <div className="relative z-10 h-full container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Column 1: Sticky Title - Stays visible for entire section */}
          <div
            ref={leftColumnRef}
            className="flex items-center lg:sticky lg:top-1/2 lg:-translate-y-1/2 self-start lg:self-center"
          >
            <div className="space-y-6 w-full">
              <Badge variant="secondary" className="mb-4">
                Industries
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {title}
              </h2>
              {description && (
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Animated Scrollable Content */}
          <div
            ref={rightColumnWrapperRef}
            className="relative h-full overflow-hidden"
          >
            {/* Inner wrapper that moves with scroll */}
            <div
              ref={rightColumnInnerRef}
              className="space-y-6"
              style={{ willChange: 'transform' }}
            >
              {sectors.map((sector, index) => {
                // Handle different image formats
                let sectorImage: string | null = null
                if (sector.image) {
                  if (typeof sector.image === 'object' && sector.image !== null) {
                    if ('url' in sector.image && sector.image.url) {
                      // Handle absolute or relative URLs
                      sectorImage = sector.image.url.startsWith('http')
                        ? sector.image.url
                        : sector.image.url.startsWith('/')
                          ? sector.image.url
                          : `/${sector.image.url}`
                    } else if ('filename' in sector.image && sector.image.filename) {
                      sectorImage = `/media/${sector.image.filename}`
                    }
                  }
                }

                // Determine the primary link - prioritize contact, then blog
                const primaryLink = sector.ctaContact || sector.ctaBlog
                const hasLink = Boolean(primaryLink)

                const cardContent = (
                  <Card className={`hover:shadow-lg transition-shadow ${hasLink ? 'cursor-pointer hover:border-primary' : ''}`}>
                    {/* Sector Image */}
                    {sectorImage && (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={sectorImage}
                          alt={sector.name || 'Sector image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{sector.name}</CardTitle>
                    </CardHeader>
                    {sector.description && (
                      <CardContent>
                        <CardDescription className="mb-4">
                          {sector.description}
                        </CardDescription>
                        {sector.useCases && sector.useCases.length > 0 && (
                          <div className="space-y-2 mb-4">
                            <h4 className="text-sm font-semibold">
                              Key Applications:
                            </h4>
                            <ul className="space-y-1">
                              {sector.useCases.slice(0, 3).map((useCase, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start text-sm text-muted-foreground"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">{useCase.title}</div>
                                    {useCase.description && (
                                      <div className="text-xs text-muted-foreground/80 mt-0.5">
                                        {useCase.description}
                                      </div>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* CTA Buttons */}
                        {(sector.ctaBlog ||
                          sector.ctaContact) && (
                          <div 
                            className="flex flex-wrap gap-2 pt-2 border-t"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {sector.ctaBlog && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Link href={sector.ctaBlog}>
                                  Blog
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                            {sector.ctaContact && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Link href={sector.ctaContact}>
                                  Contact
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
                  <div key={index} className="sector-item">
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
