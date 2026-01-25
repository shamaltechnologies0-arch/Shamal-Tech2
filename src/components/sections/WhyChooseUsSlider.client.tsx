'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined' && gsap && ScrollTrigger) {
  try {
    gsap.registerPlugin(ScrollTrigger)
  } catch (e) {
    // Plugin already registered
  }
}

interface WhyChooseUsItem {
  title?: string
  description?: string
  content?: string
  image?: {
    id?: string
    url?: string
    filename?: string
    alt?: string
    mimeType?: string
  } | string | null
}

interface WhyChooseUsSliderProps {
  title?: string
  subtitle?: string
  items: WhyChooseUsItem[]
  className?: string
}

export function WhyChooseUsSlider({
  title = 'Why Choose Us',
  subtitle,
  items,
  className = '',
}: WhyChooseUsSliderProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)
  const contentItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const imageItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (
      !sectionRef.current ||
      !leftColumnRef.current ||
      !rightColumnRef.current ||
      items.length === 0
    )
      return
    if (isInitializedRef.current) return

    if (typeof window === 'undefined') return
    if (!gsap || !ScrollTrigger) return

    // Only run on desktop (lg breakpoint and above)
    const isDesktop = window.innerWidth >= 1024
    if (!isDesktop) return

    try {
      gsap.registerPlugin(ScrollTrigger)
    } catch (e) {
      // Plugin already registered
    }

    const section = sectionRef.current
    const leftColumn = leftColumnRef.current
    const rightColumn = rightColumnRef.current

    let pinTrigger: ScrollTrigger | null = null
    const scrollTriggers: ScrollTrigger[] = []
    let handleResize: (() => void) | null = null
    let timeoutId: NodeJS.Timeout | null = null

    const initScrollTrigger = () => {
      if (isInitializedRef.current) return

      if (!section || !leftColumn || !rightColumn) {
        console.warn('WhyChooseUsSlider: Elements not available')
        return
      }

      if (!ScrollTrigger || typeof ScrollTrigger.create !== 'function') {
        console.error('WhyChooseUsSlider: ScrollTrigger not loaded')
        return
      }

      try {
        const initAnimation = () => {
          if (isInitializedRef.current) return

          // Kill any existing ScrollTriggers for this section
          ScrollTrigger.getAll().forEach((trigger) => {
            try {
              if (trigger.vars.trigger === section || trigger.vars.trigger === leftColumn) {
                trigger.kill()
              }
            } catch (e) {
              // Ignore cleanup errors
            }
          })

          // Calculate total scroll distance based on left column content
          // Each content item should occupy approximately 100vh
          const viewportHeight = window.innerHeight
          const itemCount = contentItemsRef.current.filter((item) => item !== null).length
          const scrollDistance = itemCount * viewportHeight

          // Pin the section to control scroll behavior
          // This allows the left column to scroll through while right column stays fixed
          pinTrigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: `+=${scrollDistance}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false,
          })

          // Initialize all images as hidden (scale 0, opacity 0)
          imageItemsRef.current.forEach((imageItem, index) => {
            if (!imageItem) return
            gsap.set(imageItem, {
              scale: 0,
              opacity: 0,
              zIndex: 1,
            })
          })

          // Set up scroll triggers for each content item
          contentItemsRef.current.forEach((contentItem, index) => {
            if (!contentItem) return

            const imageItem = imageItemsRef.current[index]
            if (!imageItem) return

            // Create scroll trigger for each content item
            const trigger = ScrollTrigger.create({
              trigger: contentItem,
              start: 'top center',
              end: 'bottom center',
              scrub: true,
              onEnter: () => {
                // Hide all images first
                imageItemsRef.current.forEach((img, idx) => {
                  if (img) {
                    gsap.to(img, {
                      scale: 0,
                      opacity: 0,
                      duration: 0.5,
                      ease: 'power2.out',
                      zIndex: 1,
                    })
                  }
                })
                // Reveal current image with scale animation
                gsap.to(imageItem, {
                  scale: 1,
                  opacity: 1,
                  duration: 0.5,
                  ease: 'power2.out',
                  zIndex: 2,
                })
              },
              onEnterBack: () => {
                // Hide all images first
                imageItemsRef.current.forEach((img, idx) => {
                  if (img) {
                    gsap.to(img, {
                      scale: 0,
                      opacity: 0,
                      duration: 0.5,
                      ease: 'power2.out',
                      zIndex: 1,
                    })
                  }
                })
                // Reveal current image
                gsap.to(imageItem, {
                  scale: 1,
                  opacity: 1,
                  duration: 0.5,
                  ease: 'power2.out',
                  zIndex: 2,
                })
              },
            })

            scrollTriggers.push(trigger)

            // Animate text content on scroll
            const textElements = contentItem.querySelectorAll('h2, p, div')
            gsap.fromTo(
              textElements,
              {
                y: 30,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: contentItem,
                  start: 'top 80%',
                  end: 'top 50%',
                  scrub: true,
                },
              }
            )
          })

          // Show first image initially
          const firstImage = imageItemsRef.current[0]
          if (firstImage) {
            gsap.set(firstImage, {
              scale: 1,
              opacity: 1,
              zIndex: 2,
            })
          }

          isInitializedRef.current = true
          ScrollTrigger.refresh()
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(initAnimation)
        })
      } catch (error) {
        console.error('WhyChooseUsSlider: Error initializing ScrollTrigger:', error)
      }
    }

    const attemptInit = () => {
      const lenisReady = (window as any).lenisReady
      const lenisInstance = (window as any).lenis
      const isScrollTriggerReady =
        ScrollTrigger && typeof ScrollTrigger.create === 'function'

      if (isScrollTriggerReady && (lenisReady || lenisInstance)) {
        initScrollTrigger()
      } else {
        const attempts = (attemptInit as any).attempts || 0
        if (attempts < 15) {
          ;(attemptInit as any).attempts = attempts + 1
          timeoutId = setTimeout(attemptInit, 100)
        } else {
          console.warn('Initializing ScrollTrigger without Lenis')
          initScrollTrigger()
        }
      }
    }

    timeoutId = setTimeout(attemptInit, 500)

    handleResize = () => {
      if (ScrollTrigger) {
        ScrollTrigger.refresh()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      isInitializedRef.current = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (pinTrigger) {
        try {
          pinTrigger.kill()
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      scrollTriggers.forEach((trigger) => {
        try {
          trigger.kill()
        } catch (e) {
          // Ignore cleanup errors
        }
      })
      if (handleResize) {
        window.removeEventListener('resize', handleResize)
      }
      if (ScrollTrigger && ScrollTrigger.getAll) {
        try {
          ScrollTrigger.getAll().forEach((trigger) => {
            try {
              if (trigger.vars.trigger === section) {
                trigger.kill()
              }
            } catch (e) {
              // Ignore cleanup errors
            }
          })
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [items])

  // Get image URL helper
  const getImageUrl = (image: WhyChooseUsItem['image']): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    if (image.url) {
      return image.url.startsWith('http')
        ? image.url
        : image.url.startsWith('/')
          ? image.url
          : `/${image.url}`
    }
    if (image.filename) {
      return `/media/${image.filename}`
    }
    return null
  }

  if (items.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className={`why-choose-us-section relative w-full overflow-hidden bg-[#F2F3F4] ${className}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-logo-navy mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-logo-blue max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Desktop: 2-column grid */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left Column: Text Content */}
          <div ref={leftColumnRef} className="space-y-0">
            {items.map((item, index) => {
              const content = item.description || item.content || ''

              return (
                <div
                  key={index}
                  ref={(el) => {
                    contentItemsRef.current[index] = el
                  }}
                  className="content-item min-h-screen flex flex-col justify-center py-20 lg:min-h-[100vh]"
                >
                  <div className="space-y-6">
                    {item.title && (
                      <h3 className="text-3xl md:text-4xl xl:text-5xl font-bold text-logo-navy">
                        {item.title}
                      </h3>
                    )}
                    {content && (
                      <p className="text-lg md:text-xl xl:text-2xl text-logo-blue leading-relaxed max-w-2xl">
                        {content}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Sticky Image Container */}
          <div className="relative">
            <div
              ref={rightColumnRef}
              className="sticky top-0 h-screen flex items-center justify-center lg:block hidden"
            >
              <div className="relative w-full h-[60vh] max-w-lg mx-auto">
                {items.map((item, index) => {
                  const imageUrl = getImageUrl(item.image)
                  if (!imageUrl) return null

                  return (
                    <div
                      key={index}
                      ref={(el) => {
                        imageItemsRef.current[index] = el
                      }}
                      className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl"
                      style={{
                        transform: 'scale(0)',
                        opacity: 0,
                        zIndex: index === 0 ? 2 : 1,
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={item.title || `Image ${index + 1}`}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="lg:hidden space-y-12 md:space-y-16">
          {items.map((item, index) => {
            const imageUrl = getImageUrl(item.image)
            const content = item.description || item.content || ''

            return (
              <div key={index} className="space-y-6">
                {/* Image above text on mobile */}
                {imageUrl && (
                  <div className="relative w-full h-[50vh] md:h-[60vh] rounded-xl overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={item.title || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="100vw"
                    />
                  </div>
                )}

                {/* Text content */}
                <div className="space-y-4">
                  {item.title && (
                    <h3 className="text-2xl md:text-3xl font-bold text-logo-navy">
                      {item.title}
                    </h3>
                  )}
                  {content && (
                    <p className="text-base md:text-lg text-logo-blue leading-relaxed">
                      {content}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

