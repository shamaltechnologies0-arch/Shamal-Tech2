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
  const rafRef = useRef<number | null>(null)

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

    function raf(time: number) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    // Integrate Lenis with GSAP ScrollTrigger using scrollerProxy
    // This must be done before any ScrollTrigger.create() calls
    if (ScrollTrigger && typeof ScrollTrigger.scrollerProxy === 'function') {
      try {
        ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(String(value), { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    })

        // Update ScrollTrigger when Lenis scrolls
        lenis.on('scroll', ScrollTrigger.update)

        // Refresh ScrollTrigger after scrollerProxy is set up
        ScrollTrigger.refresh()
      } catch (e) {
        console.warn('SmoothScrollProvider: Error setting up ScrollTrigger scrollerProxy:', e)
      }
    }

      // Update ScrollTrigger when Lenis scrolls via GSAP ticker
      let tickerCallback: ((time: number) => void) | null = null
      if (gsap && gsap.ticker) {
        tickerCallback = (time: number) => {
          lenis.raf(time * 1000)
        }
        gsap.ticker.add(tickerCallback)
        gsap.ticker.lagSmoothing(0)
      }

      // Scroll to top on route change
      if (pathname) {
        lenis.scrollTo(0, { immediate: true })
      }

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
        // Clean up ScrollTrigger scrollerProxy
        if (ScrollTrigger && typeof ScrollTrigger.scrollerProxy === 'function') {
          try {
            ScrollTrigger.scrollerProxy(document.body, {})
            ScrollTrigger.refresh()
          } catch (e) {
            console.warn('SmoothScrollProvider: Error cleaning up ScrollTrigger:', e)
          }
        }
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

