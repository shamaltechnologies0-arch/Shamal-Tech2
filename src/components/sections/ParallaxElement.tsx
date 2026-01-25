'use client'

import React, { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../../utilities/ui'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ParallaxElementProps {
  children: ReactNode
  speed?: number
  direction?: 'up' | 'down'
  className?: string
}

/**
 * ParallaxElement - Creates parallax scrolling effect
 * High-impact cinematic parallax for immersive storytelling
 */
export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof window === 'undefined') return

    if (!gsap || !ScrollTrigger) {
      return
    }

    const multiplier = direction === 'up' ? -1 : 1
    const yValue = speed * 100 * multiplier

    const animation = gsap.to(element, {
      y: yValue,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill()
        }
      })
    }
  }, [speed, direction])

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}

