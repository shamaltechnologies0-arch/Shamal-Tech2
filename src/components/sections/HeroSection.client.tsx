'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '../../utilities/ui'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  backgroundImage?: {
    url?: string
    alt?: string
  } | null
}

export function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initAnimation = () => {
      const lenisReady = (window as any).lenisReady
      if (!lenisReady && !(window as any).lenis) {
        setTimeout(initAnimation, 100)
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Animate badge
      if (badgeRef.current) {
        tl.from(badgeRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
        })
      }

      // Animate title
      if (titleRef.current) {
        tl.from(
          titleRef.current,
          {
            opacity: 0,
            y: 80,
            duration: 1.2,
          },
          '-=0.5'
        )
      }

      // Animate subtitle
      if (subtitleRef.current) {
        tl.from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 60,
            duration: 1,
          },
          '-=0.8'
        )
      }

      // Animate buttons
      if (buttonsRef.current) {
        tl.from(
          buttonsRef.current,
          {
            opacity: 0,
            y: 40,
            duration: 0.8,
          },
          '-=0.6'
        )
      }

      // Parallax effect on scroll
      if (heroRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            if (titleRef.current) {
              gsap.set(titleRef.current, {
                y: progress * 50,
                opacity: 1 - progress * 0.5,
              })
            }
            if (subtitleRef.current) {
              gsap.set(subtitleRef.current, {
                y: progress * 40,
                opacity: 1 - progress * 0.5,
              })
            }
          },
        })
      }
    }

    initAnimation()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImage?.url ? (
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || 'Hero background'}
            fill
            className="object-cover"
            priority
            quality={90}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-logo-blue via-logo-navy to-logo-navy" />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div ref={badgeRef} className="opacity-0">
            <Badge variant="outline" className="mb-4 text-sm border-logo-blue text-logo-blue bg-logo-blue/10">
              Leading Geospatial Solutions Provider
            </Badge>
          </div>

          <h1
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight text-foreground opacity-0"
          >
            {title || 'Shamal Technologies'}
          </h1>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed opacity-0"
          >
            {subtitle || 'Pioneering provider of drone and geospatial solutions in Saudi Arabia'}
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 opacity-0">
            <Button asChild size="lg" className="text-base px-8 h-14 bg-logo-blue hover:bg-logo-blue/90">
              <Link href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 h-14 border-2 border-logo-navy text-logo-navy hover:bg-logo-navy hover:text-white"
            >
              <Link href="/services">Our Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

