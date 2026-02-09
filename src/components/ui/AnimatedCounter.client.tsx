'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  decimals?: number
}

export function AnimatedCounter({
  value,
  duration = 2000,
  suffix = '',
  prefix = '',
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  // Ensure value is always a valid number (CMS may return string or undefined)
  const targetValue = typeof value === 'number' && !Number.isNaN(value) ? value : 0

  useEffect(() => {
    const element = ref.current
    if (!element || hasAnimated.current || typeof window === 'undefined') return

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      onEnter: () => {
        if (!hasAnimated.current) {
          hasAnimated.current = true
          animateCounter(targetValue, duration, decimals, setCount)
        }
      },
    })

    // Also trigger immediately if already in view (e.g. stats section visible on load)
    const rect = element.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      animateCounter(targetValue, duration, decimals, setCount)
      scrollTrigger.kill()
    }

    return () => {
      scrollTrigger.kill()
    }
  }, [targetValue, duration, decimals])

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals)
    }
    return Math.floor(num).toString()
  }

  return (
    <div ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </div>
  )
}

function animateCounter(
  target: number,
  duration: number,
  decimals: number,
  setCount: (value: number) => void
) {
  const start = 0
  const startTime = performance.now()

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = start + (target - start) * easeOut

    setCount(current)

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      setCount(target)
    }
  }

  requestAnimationFrame(update)
}

