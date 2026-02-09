'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '../../utilities/ui'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'

interface Section {
  id: string
  label: string
}

interface ScrollIndicatorProps {
  sections: Section[]
}

const sectionLabelKeys: Record<string, keyof ReturnType<typeof getCommonTranslations>> = {
  hero: 'hero',
  stats: 'impact',
  services: 'ourServices',
  sectors: 'sectors',
  about: 'about',
  blog: 'insights',
  contact: 'contactUs',
}

/**
 * ScrollIndicator - Visual navigation dots for scroll sections
 * Shows active section and allows smooth navigation
 */
export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '')
  const pathname = usePathname()
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  useEffect(() => {
    if (typeof window === 'undefined' || sections.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [sections, pathname])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element && typeof window !== 'undefined' && (window as any).lenis) {
      ;(window as any).lenis.scrollTo(element, { offset: 0, duration: 1.5 })
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (sections.length === 0) return null

  return (
    <nav className="scroll-indicator" aria-label="Section navigation">
      {sections.map((section) => {
        const labelKey = sectionLabelKeys[section.id]
        const label = labelKey ? t[labelKey] : section.label
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              'scroll-dot',
              activeSection === section.id && 'active',
              'hover:scale-150 transition-transform',
            )}
            aria-label={`Go to ${label}`}
            title={label}
          />
        )
      })}
    </nav>
  )
}

