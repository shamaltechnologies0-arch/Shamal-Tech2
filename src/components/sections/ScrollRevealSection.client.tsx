'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../../utilities/ui'

interface ScrollRevealSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  delay?: number
  duration?: number
  stagger?: number
}

export const ScrollRevealSection: React.FC<ScrollRevealSectionProps> = ({
  children,
  className,
  id,
  direction = 'up',
  delay = 0,
  duration = 1,
  stagger = 0,
}) => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    if (!section) return

    // Wait for Lenis and ScrollTrigger to be ready
    const initScrollTrigger = () => {
      const lenisReady = (window as any).lenisReady
      if (!lenisReady && !(window as any).lenis) {
        setTimeout(initScrollTrigger, 100)
        return
      }

      const elements = section.querySelectorAll('[data-reveal]')
      
      if (elements.length === 0) {
        // If no child elements with data-reveal, animate the section itself
        const fromProps: gsap.TweenVars = {
          opacity: 0,
        }

        switch (direction) {
          case 'up':
            fromProps.y = 60
            break
          case 'down':
            fromProps.y = -60
            break
          case 'left':
            fromProps.x = 60
            break
          case 'right':
            fromProps.x = -60
            break
          case 'fade':
            break
        }

        gsap.fromTo(
          section,
          fromProps,
          {
            ...fromProps,
            opacity: 1,
            x: 0,
            y: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none none',
            },
          }
        )
      } else {
        // Animate child elements with stagger
        const fromProps: gsap.TweenVars = {
          opacity: 0,
        }

        switch (direction) {
          case 'up':
            fromProps.y = 60
            break
          case 'down':
            fromProps.y = -60
            break
          case 'left':
            fromProps.x = 60
            break
          case 'right':
            fromProps.x = -60
            break
          case 'fade':
            break
        }

        gsap.fromTo(
          elements,
          fromProps,
          {
            ...fromProps,
            opacity: 1,
            x: 0,
            y: 0,
            duration,
            delay,
            stagger,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }

    initScrollTrigger()

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section) {
          trigger.kill()
        }
      })
    }
  }, [direction, delay, duration, stagger])

  return (
    <section ref={sectionRef} id={id} className={cn('relative', className)}>
      {children}
    </section>
  )
}

