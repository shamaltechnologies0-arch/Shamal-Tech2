'use client'

import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ContactForm } from '../ContactForm'
import { ScrollReveal } from '../../utilities/animations'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'

type Service = { id: string; title?: string | null; titleAr?: string | null; slug?: string | null }

interface ContactPageContentProps {
  services: Service[]
  contactInfo?: {
    phone?: string
    email?: string
    address?: string
    addressAr?: string
  }
  mapEmbedUrl?: string
  mapLink?: string
}

export function ContactPageContent({
  services,
  contactInfo,
  mapEmbedUrl,
  mapLink,
}: ContactPageContentProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      <ScrollReveal direction="left" delay={0.2} duration={1}>
        <Card className="border-2 border-logo-blue/20 shadow-xl bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-display font-bold text-logo-navy">
              {t.sendUsMessage}
            </CardTitle>
            <CardDescription className="text-base text-logo-blue font-medium">
              {t.sendMessageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm services={services} />
          </CardContent>
        </Card>
      </ScrollReveal>

      <div className="space-y-6">
        <ScrollReveal direction="right" delay={0.3} duration={1}>
          <Card className="border-2 border-logo-blue/20 shadow-xl bg-background/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-display font-bold text-logo-navy">
                {t.contactInformation}
              </CardTitle>
              <CardDescription className="text-base text-logo-blue font-medium">
                {t.contactInfoDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo?.phone && (
                <div className="flex gap-4">
                  <div className="p-3 rounded-lg bg-logo-blue/10">
                    <Phone className="h-5 w-5 text-logo-blue" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-logo-navy mb-1">{t.phone}</h3>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-logo-blue hover:text-logo-navy hover:underline font-medium"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo?.email && (
                <div className="flex gap-4">
                  <div className="p-3 rounded-lg bg-logo-blue/10">
                    <Mail className="h-5 w-5 text-logo-blue" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-logo-navy mb-1">{t.email}</h3>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-logo-blue hover:text-logo-navy hover:underline font-medium"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {(contactInfo?.address || contactInfo?.addressAr) && (
                <div className="flex gap-4">
                  <div className="p-3 rounded-lg bg-logo-blue/10">
                    <MapPin className="h-5 w-5 text-logo-blue" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-logo-navy mb-1">{t.address}</h3>
                    <p className="text-logo-blue font-medium">
                      {language === 'ar' && contactInfo.addressAr
                        ? contactInfo.addressAr
                        : contactInfo.address}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <div className="p-3 rounded-lg bg-logo-blue/10">
                  <Clock className="h-5 w-5 text-logo-blue" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-logo-navy mb-1">
                    {t.businessHours}
                  </h3>
                  <p className="text-logo-blue font-medium">
                    {t.businessHoursValue}
                    <br />
                    {t.businessHoursClosed}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {mapEmbedUrl && (
          <ScrollReveal direction="right" delay={0.4} duration={1}>
            <Card className="border-2 border-logo-blue/20 shadow-xl bg-background/95 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                  {t.ourLocation}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full h-96">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t.ourLocation}
                    className="absolute inset-0"
                  />
                </div>
                {mapLink && (
                  <div className="p-4 border-t border-logo-blue/20">
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-logo-blue hover:text-logo-navy hover:underline text-sm font-semibold"
                    >
                      {t.viewOnGoogleMaps} →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}
