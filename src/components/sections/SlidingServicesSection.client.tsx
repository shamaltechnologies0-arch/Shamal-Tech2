'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { cn } from '../../utilities/ui'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin()
}

interface Service {
  id: string
  title: string | null
  titleAr?: string | null
  slug: string | null
}

interface SlidingServicesSectionProps {
  services: Service[]
  className?: string
}

/**
 * SlidingServicesSection - Infinite horizontal sliding services display
 * Displays service titles in a smooth, continuous left-to-right loop
 * - Pauses on hover
 * - Highlights hovered service
 * - Gradient fade on edges
 * - Clickable to navigate to service detail pages
 */
export function SlidingServicesSection({ services, className }: SlidingServicesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { language } = useLanguage()

  // Filter out services without titles (localized)
  const validServices = services.filter((service) => {
    const title = getLocalizedValue(service.title, service.titleAr, language)
    return title
  }).map((service) => ({
    ...service,
    displayTitle: getLocalizedValue(service.title, service.titleAr, language),
  }))

  useEffect(() => {
    if (!trackRef.current || !containerRef.current || validServices.length === 0) return

    const track = trackRef.current
    const container = containerRef.current
    let animation: gsap.core.Tween | null = null
    let cleanup: (() => void) | null = null

    // Wait for layout to calculate widths
    const initAnimation = () => {
      // Calculate the width of one set of services
      const totalServicesInSet = validServices.length
      
      // Get computed gap value (24px on mobile, 48px on desktop)
      const computedStyle = window.getComputedStyle(track)
      const gap = parseFloat(computedStyle.gap) || 24
      
      let singleSetWidth = 0

      // Calculate width of one complete set
      for (let i = 0; i < totalServicesInSet; i++) {
        const child = track.children[i] as HTMLElement
        if (child) {
          singleSetWidth += child.offsetWidth
          // Add gap except for the last item
          if (i < totalServicesInSet - 1) {
            singleSetWidth += gap
          }
        }
      }

      if (singleSetWidth === 0) {
        // Fallback: use scrollWidth / 3
        singleSetWidth = track.scrollWidth / 3
      }

      // Ensure we have enough width to animate smoothly
      if (singleSetWidth < 100) {
        singleSetWidth = track.scrollWidth / 3
      }

      const speed = 50 // pixels per second - adjust for desired speed

      // Create infinite scroll animation
      animation = gsap.to(track, {
        x: -singleSetWidth,
        duration: singleSetWidth / speed,
        ease: 'none',
        repeat: -1,
      })

      animationRef.current = animation

      // Pause on hover
      const handleMouseEnter = () => {
        animation?.pause()
      }

      const handleMouseLeave = () => {
        animation?.resume()
      }

      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)

      cleanup = () => {
        animation?.kill()
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    // Wait for next frame to ensure layout is calculated
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(initAnimation)
    })

    return () => {
      cancelAnimationFrame(rafId)
      if (cleanup) cleanup()
      if (animation) animation.kill()
    }
  }, [validServices])

  if (!services || services.length === 0) return null

  if (validServices.length === 0) return null

  // Duplicate services for seamless infinite scroll (3 sets for smooth looping)
  const servicesToRender = [...validServices, ...validServices, ...validServices]

  // Force LTR for carousel: sliding animation and layout work correctly only in LTR.
  // In RTL pages, isolate this section so it always behaves as left-to-right.
  return (
    <section
      ref={containerRef}
      dir="ltr"
      className={cn(
        'relative w-full overflow-hidden bg-background/50 border-y border-logo-blue/10',
        className
      )}
      role="region"
      aria-label="Services"
      aria-roledescription="carousel"
    >
      {/* Gradient fade overlays - Premium feel */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-background via-background/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-background via-background/60 to-transparent z-10 pointer-events-none" />

      <div className="relative py-6 md:py-8">
        <div
          ref={trackRef}
          className="flex items-center gap-6 md:gap-12 will-change-transform"
          role="group"
        >
          {servicesToRender.map((service, index) => {
            const isHovered = hoveredIndex === index
            const serviceSlug = service.slug || ''

            return (
              <div
                key={`${service.id}-${Math.floor(index / validServices.length)}`}
                role="group"
                aria-roledescription="slide"
                className="flex-shrink-0"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {serviceSlug ? (
                  <Link
                    href={`/services/${serviceSlug}`}
                    className={cn(
                      'inline-block px-6 md:px-8 py-3 md:py-4 rounded-full',
                      'text-base md:text-lg lg:text-xl font-semibold',
                      'transition-all duration-300 ease-out',
                      'border-2 border-logo-blue/20 bg-background/80 backdrop-blur-sm',
                      'hover:border-logo-blue hover:bg-logo-blue/10',
                      'hover:scale-105 hover:shadow-lg',
                      'text-logo-navy hover:text-logo-blue',
                      isHovered && 'border-logo-blue bg-logo-blue/15 scale-105 shadow-lg text-logo-blue'
                    )}
                  >
                    {service.displayTitle}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'inline-block px-6 md:px-8 py-3 md:py-4 rounded-full',
                      'text-base md:text-lg lg:text-xl font-semibold',
                      'transition-all duration-300 ease-out',
                      'border-2 border-logo-blue/20 bg-background/80 backdrop-blur-sm',
                      'text-logo-navy',
                      isHovered && 'border-logo-blue/40 bg-logo-blue/10 scale-105'
                    )}
                  >
                    {service.displayTitle}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
