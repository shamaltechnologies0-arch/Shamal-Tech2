'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface HeroEnhancedProps {
  children: React.ReactNode
}

/**
 * HeroEnhanced - Enhanced hero section with subtle abstract motion overlays
 * Creates cinematic depth with animated geometric shapes over video background
 */
export function HeroEnhanced({ children }: HeroEnhancedProps) {
  const overlay1Ref = useRef<HTMLDivElement>(null)
  const overlay2Ref = useRef<HTMLDivElement>(null)
  const overlay3Ref = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Find the hero section element
    heroSectionRef.current = document.getElementById('hero')

    const initAnimation = () => {
      const lenisReady = (window as any).lenisReady
      if (!lenisReady && !(window as any).lenis) {
        setTimeout(initAnimation, 100)
        return
      }

      // Subtle floating animation for overlay shapes
      if (overlay1Ref.current) {
        gsap.to(overlay1Ref.current, {
          x: 'random(-30, 30)',
          y: 'random(-30, 30)',
          rotation: 'random(-15, 15)',
          duration: 'random(20, 30)',
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      if (overlay2Ref.current) {
        gsap.to(overlay2Ref.current, {
          x: 'random(-40, 40)',
          y: 'random(-40, 40)',
          rotation: 'random(-20, 20)',
          duration: 'random(25, 35)',
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      if (overlay3Ref.current) {
        gsap.to(overlay3Ref.current, {
          x: 'random(-25, 25)',
          y: 'random(-25, 25)',
          rotation: 'random(-10, 10)',
          duration: 'random(18, 28)',
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      // Parallax effect on scroll
      if (heroSectionRef.current) {
        ScrollTrigger.create({
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            if (overlay1Ref.current) {
              gsap.set(overlay1Ref.current, {
                y: progress * 50,
                opacity: Math.max(0.05 - progress * 0.05, 0),
              })
            }
            if (overlay2Ref.current) {
              gsap.set(overlay2Ref.current, {
                y: progress * 70,
                opacity: Math.max(0.05 - progress * 0.05, 0),
              })
            }
            if (overlay3Ref.current) {
              gsap.set(overlay3Ref.current, {
                y: progress * 40,
                opacity: Math.max(0.04 - progress * 0.04, 0),
              })
            }
          },
        })
      }
    }

    initAnimation()
  }, [])

  return (
    <>
      {/* Motion Overlays - Subtle abstract shapes */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Large geometric shape - top right */}
        <div
          ref={overlay1Ref}
          className="absolute top-20 right-20 w-96 h-96 opacity-[0.05] mix-blend-overlay"
          style={{
            background: 'radial-gradient(circle, hsl(var(--logo-blue)) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          aria-hidden="true"
        />
        
        {/* Medium geometric shape - bottom left */}
        <div
          ref={overlay2Ref}
          className="absolute bottom-32 left-16 w-80 h-80 opacity-[0.05] mix-blend-overlay"
          style={{
            background: 'radial-gradient(circle, hsl(var(--logo-navy)) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          aria-hidden="true"
        />
        
        {/* Small geometric shape - center */}
        <div
          ref={overlay3Ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.04] mix-blend-overlay"
          style={{
            background: 'radial-gradient(circle, hsl(var(--logo-blue)) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      {children}
    </>
  )
}
