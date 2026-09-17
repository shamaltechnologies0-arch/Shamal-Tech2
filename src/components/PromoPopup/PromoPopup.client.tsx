'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { GraduationCap, ShoppingBag, X } from 'lucide-react'

import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { localizeHref, stripLocalePrefix } from '../../lib/i18n/locale'
import type { PromoPopupData, PromoPopupSectionData } from './types'
import { DEFAULT_PROMO_POPUP } from './types'
import { isExternalPromoHref, normalizePromoHref } from './promoHref'

const STORAGE_KEY = 'shamal-promo-modal-dismissed-at'

const HIDDEN_PATH_PREFIXES = [
  '/training',
  '/products',
  '/admin',
  '/company-profile',
  '/profile/',
  '/employee/',
  '/api',
] as const

function shouldHideForPath(pathname: string | null): boolean {
  if (!pathname) return false
  return HIDDEN_PATH_PREFIXES.some((prefix) => {
    if (prefix.endsWith('/')) return pathname.startsWith(prefix)
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}

function shouldShowFromStorage(intervalDays: number): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return true
    const dismissedAt = Number(raw)
    if (!Number.isFinite(dismissedAt)) return true
    const intervalMs = Math.max(1, intervalDays) * 24 * 60 * 60 * 1000
    return Date.now() - dismissedAt >= intervalMs
  } catch {
    return true
  }
}

function persistDismissal(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    // Ignore quota / private-mode failures
  }
}

function stopLenis(): (() => void) | undefined {
  const lenis = (window as Window & { lenis?: { stop?: () => void; start?: () => void } }).lenis
  if (!lenis?.stop) return undefined
  lenis.stop()
  return () => {
    lenis.start?.()
  }
}

function SectionIcon({ id }: { id: PromoPopupSectionData['id'] }) {
  const Icon = id === 'academy' ? GraduationCap : ShoppingBag
  return <Icon className="h-3.5 w-3.5 text-[#7EB6E8]" aria-hidden />
}

type PromoPopupClientProps = {
  data?: PromoPopupData
}

export function PromoPopupClient({ data = DEFAULT_PROMO_POPUP }: PromoPopupClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const titleId = useId()
  const reduceMotion = useReducedMotion()
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const isRtl = language === 'ar'
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const hideForRoute = shouldHideForPath(stripLocalePrefix(pathname || '/'))
  const { enabled, showIntervalDays, openDelayMs, sections } = data
  const localizedSections = sections.map((section) => {
    const copy = section.id === 'academy' ? t.promoPopup.academy : t.promoPopup.products
    const fallbackHref = section.id === 'academy' ? '/training' : '/products'
    return {
      ...section,
      badge: copy.badge,
      title: copy.title,
      subtitle: copy.subtitle,
      ctaLabel: copy.ctaLabel,
      imageAlt: copy.imageAlt,
      ctaHref: normalizePromoHref(section.ctaHref, fallbackHref),
    }
  })

  const close = useCallback((event?: { preventDefault?: () => void; stopPropagation?: () => void }) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()
    persistDismissal()
    setOpen(false)
  }, [])

  const navigateToSection = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        persistDismissal()
        return
      }

      event.preventDefault()
      event.stopPropagation()
      persistDismissal()

      const destination = isExternalPromoHref(href) ? href : localizeHref(href, language)
      setOpen(false)

      if (isExternalPromoHref(destination)) {
        window.location.assign(destination)
        return
      }

      router.push(destination)
    },
    [language, router],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!enabled || hideForRoute) {
      setOpen(false)
      return
    }

    if (!shouldShowFromStorage(showIntervalDays)) return

    const timer = window.setTimeout(() => setOpen(true), Math.max(0, openDelayMs))
    return () => window.clearTimeout(timer)
  }, [enabled, hideForRoute, openDelayMs, pathname, showIntervalDays])

  useEffect(() => {
    if (!open) return

    const html = document.documentElement
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = html.style.overflow
    document.body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    const resumeLenis = stopLenis()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      html.style.overflow = previousHtmlOverflow
      resumeLenis?.()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  if (!mounted || !enabled || hideForRoute) return null

  const overlayTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }

  const modalTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const }

  const modal = (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-[11000] flex items-stretch justify-center md:items-center md:p-6"
          style={{ WebkitTransform: 'translateZ(0)' }}
        >
          <motion.button
            type="button"
            aria-label={t.promoPopup.closeOverlay}
            className="absolute inset-0 bg-[#020810]/80 md:bg-[#020810]/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            onClick={close}
          >
            <span className="sr-only">{t.promoPopup.closeOverlay}</span>
          </motion.button>

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            lang={language}
            dir={isRtl ? 'rtl' : 'ltr'}
            className="relative z-10 flex h-[100dvh] max-h-[100dvh] w-full min-h-0 flex-col overflow-hidden border border-white/15 bg-[linear-gradient(160deg,#0A3254_0%,#081c30_55%,#061220_100%)] shadow-[0_32px_80px_rgba(0,0,0,0.45)] md:h-auto md:max-h-[min(90dvh,720px)] md:w-[1000px] md:max-w-[calc(100vw-3rem)] md:rounded-2xl md:bg-[linear-gradient(160deg,rgba(10,50,84,0.96)_0%,rgba(8,28,48,0.98)_55%,rgba(6,18,32,1)_100%)]"
            style={{
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            transition={modalTransition}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <span id={titleId} className="sr-only">
              {localizedSections.map((s) => s.title).join(` ${t.promoPopup.and} `)}
            </span>

            <div className="relative z-30 flex shrink-0 items-center justify-end px-3 py-2 md:pointer-events-none md:absolute md:inset-x-0 md:top-0 md:px-4 md:py-4">
              <button
                type="button"
                onClick={close}
                onPointerUp={(event) => {
                  if (event.pointerType !== 'mouse') close(event)
                }}
                className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-lg transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                style={{ touchAction: 'manipulation' }}
                aria-label={t.promoPopup.close}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="flex flex-col md:grid md:grid-cols-2">
                {localizedSections.map((section, index) => (
                  <motion.section
                    key={section.id}
                    className={`relative flex flex-col justify-between gap-3 px-5 pb-5 pt-2 sm:gap-4 sm:px-7 sm:pb-7 md:min-h-0 md:gap-5 md:px-8 md:pb-9 md:pt-14 ${
                      index === 0
                        ? 'border-b border-white/10 md:border-b-0 md:border-e'
                        : 'pb-8 md:pb-9'
                    }`}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { delay: 0.06 + index * 0.05, duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                    }
                  >
                    <div className="space-y-2.5 sm:space-y-3">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80 ${
                          isRtl ? 'tracking-normal' : 'uppercase tracking-[0.14em]'
                        }`}
                      >
                        <SectionIcon id={section.id} />
                        {section.badge}
                      </div>
                      <h2
                        className={`font-[family-name:var(--font-rajdhani)] text-[1.4rem] font-bold leading-tight text-white sm:text-2xl md:text-[1.65rem] ${
                          isRtl ? 'tracking-normal' : 'tracking-wide'
                        }`}
                      >
                        {section.title}
                      </h2>
                      <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-[15px]">
                        {section.subtitle}
                      </p>
                    </div>

                    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#061422] shadow-inner">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,96,147,0.28),transparent_60%)]" />
                      <div className="relative h-32 w-full sm:h-40 md:h-auto md:aspect-[5/3]">
                        <Image
                          src={section.imageSrc}
                          alt={section.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 500px"
                          className={
                            section.imageFit === 'contain'
                              ? 'object-contain p-3 sm:p-6'
                              : 'object-cover'
                          }
                          priority={index === 0}
                        />
                      </div>
                    </div>

                    <a
                      href={
                        isExternalPromoHref(section.ctaHref)
                          ? section.ctaHref
                          : localizeHref(section.ctaHref, language)
                      }
                      onClick={(event) => navigateToSection(event, section.ctaHref)}
                      className={`inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#226093] to-[#0A3254] px-5 py-3.5 text-center text-sm font-semibold text-white shadow-[0_10px_30px_rgba(10,50,84,0.45)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:min-h-[52px] sm:text-[15px] ${
                        isRtl ? 'tracking-normal' : 'tracking-wide'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {section.ctaLabel}
                    </a>
                  </motion.section>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}
