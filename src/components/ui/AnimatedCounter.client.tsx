'use client'

import { useEffect, useRef, useState } from 'react'

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

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            animateCounter(value, duration, decimals, setCount)
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [value, duration, decimals])

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

