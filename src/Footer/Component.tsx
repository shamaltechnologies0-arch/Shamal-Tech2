import { getCachedGlobal } from '../utilities/getGlobals'
import { safePayloadFind } from '../utilities/safePayloadQuery'
import Link from 'next/link'
import React from 'react'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import {
  Linkedin,
  Facebook,
  Youtube,
  Instagram,
} from 'lucide-react'

import { Logo } from '../components/Logo/Logo'
import { NewsletterForm } from '../components/NewsletterForm'

export async function Footer() {
  const siteSettings = await getCachedGlobal('site-settings', 2)()

  // Fetch services for footer (first 6 services) - using safe query with proper access control
  const services = await safePayloadFind({
    collection: 'services',
    limit: 6,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: 'createdAt',
    depth: 0,
    draft: false, // Explicitly exclude drafts
    overrideAccess: false, // Respect access control
  })

  // Type assertion for site settings
  const siteSettingsTyped = siteSettings as {
    contactInfo?: {
      phone?: string
      email?: string
      address?: string
    }
    socialMedia?: {
      linkedin?: string
      facebook?: string
      youtube?: string
      instagram?: string
      twitter?: string
      tiktok?: string
      snapchat?: string
    }
  } | null

  const contactInfo = siteSettingsTyped?.contactInfo
  const socialMedia = siteSettingsTyped?.socialMedia

  // Social media icons mapping (in order as shown in design)
  // Always show all icons, even if URLs are not configured
  const socialIcons = [
    { key: 'linkedin', icon: Linkedin, url: socialMedia?.linkedin },
    { key: 'facebook', icon: Facebook, url: socialMedia?.facebook },
    { key: 'youtube', icon: Youtube, url: socialMedia?.youtube },
    { key: 'tiktok', icon: null, url: socialMedia?.tiktok },
    { key: 'instagram', icon: Instagram, url: socialMedia?.instagram },
    { key: 'twitter', icon: null, url: socialMedia?.twitter }, // X (formerly Twitter) - using custom SVG
    { key: 'snapchat', icon: null, url: socialMedia?.snapchat },
  ]

  return (
    <footer className="mt-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Column 1: Company Information */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <Logo variant="primary" className="h-10 md:h-12 w-auto" />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Leading provider of drone surveys and geospatial solutions in Saudi Arabia,
              delivering precision insights for government and enterprise projects.
            </p>
            <div className="space-y-3 text-sm">
              {contactInfo?.phone && (
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{contactInfo.phone}</span>
                </a>
              )}
              {contactInfo?.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>{contactInfo.email}</span>
                </a>
              )}
              {contactInfo?.address && (
                <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{contactInfo.address}</span>
                </div>
              )}
            </div>
            {/* Copyright */}
            <p className="text-xs text-gray-500 dark:text-gray-500 pt-4">
              © {new Date().getFullYear()} Shamal Technologies. All rights reserved.
            </p>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              {services.docs.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline group"
            >
              View All Services
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Contact
        </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Newsletter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subscribe to get the latest updates on drone technology and geospatial solutions.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Social Media Icons Row - Always visible */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-end items-center gap-4">
            {socialIcons.map((social) => {
              const hasUrl = Boolean(social.url)
              const isDisabled = !hasUrl
              const baseClasses = isDisabled
                ? 'text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed'
                : 'text-gray-400 hover:text-primary dark:hover:text-primary transition-colors'
              const ariaLabel = social.key.charAt(0).toUpperCase() + social.key.slice(1)
              const title = isDisabled ? `${ariaLabel} - Link not configured` : ariaLabel

              const IconComponent = social.icon
              if (IconComponent) {
                if (hasUrl) {
                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={baseClasses}
                      aria-label={ariaLabel}
                      title={title}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  )
                } else {
                  return (
                    <span
                      key={social.key}
                      className={baseClasses}
                      aria-label={ariaLabel}
                      title={title}
                    >
                      <IconComponent className="h-5 w-5" />
                    </span>
                  )
                }
              }

              // For TikTok and Snapchat (no icon in lucide-react), use SVG icons
              if (social.key === 'tiktok') {
                if (hasUrl) {
                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={baseClasses}
                      aria-label="TikTok"
                      title={title}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                    </a>
                  )
                } else {
                  return (
                    <span
                      key={social.key}
                      className={baseClasses}
                      aria-label="TikTok"
                      title={title}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                    </span>
                  )
                }
              }

              if (social.key === 'snapchat') {
                if (hasUrl) {
                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={baseClasses}
                      aria-label="Snapchat"
                      title={title}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.206.793c.99 0 4.347.276 5.866 3.821.529 1.193.403 3.219.299 4.847l-.003.15h.256c1.256 0 2.816.95 3.035 2.209.121.704.067 1.512-.367 2.364-.413.822-1.162 1.762-2.485 2.244-.092.033-.17.086-.208.15-.013.022-.013.08-.011.148.003.068.013.1.042.13.081.084.396.21.586.346.816.587 1.08 1.166.648 1.46-.32.22-.854.188-1.463.038-.237-.058-1.132-.339-1.398-.484-.09-.049-.16-.09-.202-.09-.113 0-.41.29-.765.52-.89.58-2.028 1.125-3.388 1.125h-.09c-1.36 0-2.499-.545-3.389-1.125-.354-.23-.651-.52-.765-.52-.04 0-.111.041-.201.09-.266.145-1.16.426-1.397.484-.61.15-1.144.182-1.464-.038-.432-.294-.168-.873.648-1.46.19-.136.505-.262.586-.346.03-.03.04-.062.042-.13.002-.068.002-.126-.01-.148-.039-.064-.117-.117-.21-.15-1.323-.482-2.072-1.422-2.485-2.244-.434-.852-.488-1.66-.367-2.364.219-1.259 1.779-2.209 3.035-2.209h.256l-.003-.15c-.104-1.628-.23-3.654.299-4.847C7.859 1.069 11.216.793 12.206.793zm0 0" />
                      </svg>
                    </a>
                  )
                } else {
                  return (
                    <span
                      key={social.key}
                      className={baseClasses}
                      aria-label="Snapchat"
                      title={title}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.206.793c.99 0 4.347.276 5.866 3.821.529 1.193.403 3.219.299 4.847l-.003.15h.256c1.256 0 2.816.95 3.035 2.209.121.704.067 1.512-.367 2.364-.413.822-1.162 1.762-2.485 2.244-.092.033-.17.086-.208.15-.013.022-.013.08-.011.148.003.068.013.1.042.13.081.084.396.21.586.346.816.587 1.08 1.166.648 1.46-.32.22-.854.188-1.463.038-.237-.058-1.132-.339-1.398-.484-.09-.049-.16-.09-.202-.09-.113 0-.41.29-.765.52-.89.58-2.028 1.125-3.388 1.125h-.09c-1.36 0-2.499-.545-3.389-1.125-.354-.23-.651-.52-.765-.52-.04 0-.111.041-.201.09-.266.145-1.16.426-1.397.484-.61.15-1.144.182-1.464-.038-.432-.294-.168-.873.648-1.46.19-.136.505-.262.586-.346.03-.03.04-.062.042-.13.002-.068.002-.126-.01-.148-.039-.064-.117-.117-.21-.15-1.323-.482-2.072-1.422-2.485-2.244-.434-.852-.488-1.66-.367-2.364.219-1.259 1.779-2.209 3.035-2.209h.256l-.003-.15c-.104-1.628-.23-3.654.299-4.847C7.859 1.069 11.216.793 12.206.793zm0 0" />
                      </svg>
                    </span>
                  )
                }
              }

              // X (formerly Twitter) - using custom SVG
              if (social.key === 'twitter') {
                if (hasUrl) {
                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={baseClasses}
                      aria-label="X (formerly Twitter)"
                      title={title}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )
                } else {
                  return (
                    <span
                      key={social.key}
                      className={baseClasses}
                      aria-label="X (formerly Twitter)"
                      title={title}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </span>
                  )
                }
              }

              return null
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

