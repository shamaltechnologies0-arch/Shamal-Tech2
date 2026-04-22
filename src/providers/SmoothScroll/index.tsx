'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      })

      lenisRef.current = lenis

      // Make Lenis available globally for ScrollTrigger components
      ;(window as any).lenis = lenis
      ;(window as any).lenisReady = true

      // Integrate Lenis with GSAP/ScrollTrigger using a single clock source
      lenis.on('scroll', ScrollTrigger.update)
      let tickerCallback: ((time: number) => void) | null = null
      if (gsap && gsap.ticker) {
        tickerCallback = (time: number) => {
          lenis.raf(time * 1000)
        }
        gsap.ticker.add(tickerCallback)
        gsap.ticker.lagSmoothing(0)
      }
      ScrollTrigger.refresh()

      // Scroll to top on route change
      if (pathname) {
        lenis.scrollTo(0, { immediate: true })
      }

      return () => {
        if (lenis) {
          lenis.destroy()
        }
        if (tickerCallback && gsap && gsap.ticker) {
          gsap.ticker.remove(tickerCallback)
        }
        // Remove global references
        delete (window as any).lenis
        delete (window as any).lenisReady
      }
    } catch (error) {
      console.error('SmoothScrollProvider: Error initializing Lenis:', error)
      // Don't crash the page if Lenis fails - just continue without smooth scrolling
      return () => {
        // No cleanup needed if initialization failed
      }
    }
  }, [pathname])

  return <>{children}</>
}

