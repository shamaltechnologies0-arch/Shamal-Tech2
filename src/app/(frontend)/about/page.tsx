import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import { LivePreviewListener } from '../../../components/LivePreviewListener'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Target, TrendingUp, Award, Users, Clock, Building2 } from 'lucide-react'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { ScrollReveal, StaggerReveal, CinematicReveal } from '../../../utilities/animations'
import RichText from '../../../components/RichText'
import { LeadershipCarousel } from '../../../components/sections/LeadershipCarousel.client'
import { WhyChooseShamalPinnedSection } from '../../../components/sections/WhyChooseShamalPinnedSection.client'

export const metadata: Metadata = {
  title: 'About Us | Shamal Technologies',
  description:
    'Shamal Technologies is a pioneering provider of drone and geospatial solutions in Saudi Arabia. Learn about our vision, mission, team, and achievements.',
}

export default async function AboutPage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  
  // Type assertions for about page content - depth 3 to ensure media relationships are fully populated
  const aboutContent = (await getCachedGlobal('about-page-content', 3)()) as {
    hero?: {
      title?: string
      description?: string
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
      video?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
    }
    vision?: {
      title?: string
      description?: string
      content?: string | any // Can be string or Lexical JSON (for backward compatibility)
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
    }
    mission?: {
      title?: string
      description?: string
      content?: string | any // Can be string or Lexical JSON (for backward compatibility)
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
    }
    certifications?: Array<{
      name?: string
      description?: string
      image?: {
        url?: string
      }
    }>
    achievements?: Array<{
      title?: string
      description?: string
      value?: string
      icon?: string
    }>
    timeline?: Array<{
      year?: string
      title?: string
      description?: string
    }>
    leadership?: Array<{
      name?: string
      position?: string
      role?: string
      bio?: string
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
      } | string | null
    }>
    clients?: Array<{
      logo?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
      } | string | null
    }>
    testimonials?: Array<{
      name?: string
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
      } | string | null
      review?: string
    }>
    strengths?: Array<{
      title?: string
      description?: string
      icon?: string
    }>
    whyChooseUs?: {
      title?: string
      subtitle?: string
      items?: Array<{
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
      }>
    }
  } | null

  const siteSettings = (await getCachedGlobal('site-settings', 2)()) as {
    siteName?: string
    siteDescription?: string
    logo?: {
      url?: string
    }
    contactInfo?: {
      phone?: string
      email?: string
      address?: string
    }
  } | null

  // Define sections for scroll indicator
  const sections = [
    { id: 'hero', label: 'Hero' },
    ...(aboutContent?.whyChooseUs?.items && aboutContent.whyChooseUs.items.length > 0
      ? [{ id: 'why-choose-shamal', label: 'Why Choose Shamal' }]
      : [{ id: 'vision-mission', label: 'Vision & Mission' }]),
    ...(aboutContent?.certifications && aboutContent.certifications.length > 0
      ? [{ id: 'certifications', label: 'Certifications' }]
      : []),
    ...(aboutContent?.achievements && aboutContent.achievements.length > 0
      ? [{ id: 'achievements', label: 'Achievements' }]
      : []),
    ...(aboutContent?.timeline && aboutContent.timeline.length > 0
      ? [{ id: 'timeline', label: 'Timeline' }]
      : []),
    ...(aboutContent?.leadership && aboutContent.leadership.length > 0
      ? [{ id: 'leadership', label: 'Leadership' }]
      : []),
    ...(aboutContent?.clients && aboutContent.clients.length > 0
      ? [{ id: 'clients', label: 'Clients' }]
      : []),
    ...(aboutContent?.testimonials && aboutContent.testimonials.length > 0
      ? [{ id: 'testimonials', label: 'Testimonials' }]
      : []),
    ...(aboutContent?.strengths && aboutContent.strengths.length > 0
      ? [{ id: 'strengths', label: 'Strengths' }]
      : []),
  ]

  return (
    <main className="flex flex-col relative">
      {draft && <LivePreviewListener />}
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-logo-blue via-logo-navy to-logo-navy py-12 md:py-16">
        {/* Background Image or Video */}
        <div className="absolute inset-0 z-0">
          {/* Priority 1: Check if hero image exists from CMS */}
          {aboutContent?.hero?.image &&
          typeof aboutContent.hero.image === 'object' &&
          aboutContent.hero.image !== null &&
          (aboutContent.hero.image.url || aboutContent.hero.image.filename) ? (
            <>
              <Image
                src={
                  aboutContent.hero.image.url
                    ? aboutContent.hero.image.url.startsWith('http')
                      ? aboutContent.hero.image.url
                      : aboutContent.hero.image.url.startsWith('/')
                        ? aboutContent.hero.image.url
                        : `/${aboutContent.hero.image.url}`
                    : aboutContent.hero.image.filename
                      ? `/media/${aboutContent.hero.image.filename}`
                      : ''
                }
                alt={aboutContent.hero.image.alt || 'About page hero'}
                fill
                className="object-cover"
                priority
                quality={90}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : /* Priority 2: Check if hero video exists from CMS */
          aboutContent?.hero?.video &&
            typeof aboutContent.hero.video === 'object' &&
            aboutContent.hero.video !== null &&
            (aboutContent.hero.video.url || aboutContent.hero.video.filename) ? (
            <>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ minHeight: '100%', minWidth: '100%' }}
              >
                <source
                  src={
                    aboutContent.hero.video.url
                      ? aboutContent.hero.video.url.startsWith('http')
                        ? aboutContent.hero.video.url
                        : aboutContent.hero.video.url.startsWith('/')
                          ? aboutContent.hero.video.url
                          : `/${aboutContent.hero.video.url}`
                      : aboutContent.hero.video.filename
                        ? `/media/${aboutContent.hero.video.filename}`
                        : ''
                  }
                  type={aboutContent.hero.video.mimeType || 'video/mp4'}
                />
                Your browser does not support the video tag.
              </video>
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : (
            <>
              {/* Fallback: Static gradient background if no image or video */}
              <div className="absolute inset-0 bg-gradient-to-br from-logo-blue via-logo-navy to-logo-navy" />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </>
          )}
        </div>
        
        {/* Hero Text */}
        <div className="relative z-10 container mx-auto px-4 py-20 w-full">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="mb-4 text-sm border-white/40 text-white bg-white/20 backdrop-blur-sm">
              Our Story
            </Badge>
            <h1 className="text-hero font-display font-bold tracking-tight text-white drop-shadow-2xl">
              {aboutContent?.hero?.title || 'About Shamal Technologies'}
            </h1>
            {aboutContent?.hero?.description && (
              <p className="text-body-large text-white/95 max-w-3xl mx-auto drop-shadow-lg font-medium">
                {aboutContent.hero.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Shamal - Pinned Section */}
      {aboutContent?.whyChooseUs?.items && aboutContent.whyChooseUs.items.length > 0 && (
        <div id="why-choose-shamal">
          <WhyChooseShamalPinnedSection
            title={aboutContent.whyChooseUs.title || 'Why Choose Shamal'}
            subtitle={aboutContent.whyChooseUs.subtitle}
            items={aboutContent.whyChooseUs.items}
          />
        </div>
      )}

      {/* Vision & Mission Section - Fallback if Why Choose Us not available */}
      {(!aboutContent?.whyChooseUs?.items || aboutContent.whyChooseUs.items.length === 0) && (
      <section id="vision-mission" className="relative w-full">
        <ScrollSection id="vision-mission" fullViewport bgVariant="1" parallax>
            <div className="container mx-auto px-4 w-full">
              <ParallaxElement speed={0.3} direction="up">
                <CinematicReveal delay={0.2} duration={1.2}>
                  <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
                    {/* Vision */}
                    {aboutContent?.vision && (
                      <ScrollReveal direction="left" delay={0.3} duration={1}>
                        <Card className="border-2 border-logo-blue/30 shadow-xl h-full bg-background/95 backdrop-blur-sm">
                          <CardHeader>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="p-3 rounded-xl bg-logo-blue/10">
                                <Target className="h-8 w-8 text-logo-blue" />
                              </div>
                              <CardTitle className="text-3xl md:text-4xl font-display font-bold">
                                <span className="text-gradient">
                                  {aboutContent.vision.title || 'Our Vision'}
                                </span>
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {/* Vision Image */}
                            {aboutContent.vision.image &&
                            typeof aboutContent.vision.image === 'object' &&
                            aboutContent.vision.image !== null &&
                            (aboutContent.vision.image.url || aboutContent.vision.image.filename) && (
                              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                                <Image
                                  src={
                                    aboutContent.vision.image.url
                                      ? aboutContent.vision.image.url.startsWith('http')
                                        ? aboutContent.vision.image.url
                                        : aboutContent.vision.image.url.startsWith('/')
                                          ? aboutContent.vision.image.url
                                          : `/${aboutContent.vision.image.url}`
                                      : aboutContent.vision.image.filename
                                        ? `/media/${aboutContent.vision.image.filename}`
                                        : ''
                                  }
                                  alt={aboutContent.vision.image.alt || aboutContent.vision.title || 'Vision image'}
                                  fill
                                  className="object-cover"
                                  priority={false}
                                  quality={90}
                                />
                              </div>
                            )}
                            <div className="prose prose-lg md:prose-xl max-w-none text-logo-navy">
                              {/* Display description if available, otherwise content */}
                              {aboutContent.vision.description ? (
                                typeof aboutContent.vision.description === 'string' ? (
                                  <p className="whitespace-pre-wrap leading-relaxed font-medium">
                                    {aboutContent.vision.description}
                                  </p>
                                ) : (
                                  <RichText data={aboutContent.vision.description} enableGutter={false} />
                                )
                              ) : aboutContent.vision.content ? (
                                typeof aboutContent.vision.content === 'string' ? (
                                  <p className="whitespace-pre-wrap leading-relaxed font-medium">
                                    {aboutContent.vision.content}
                                  </p>
                                ) : (
                                  <RichText data={aboutContent.vision.content} enableGutter={false} />
                                )
                              ) : null}
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    )}

                    {/* Mission */}
                    {aboutContent?.mission && (
                      <ScrollReveal direction="right" delay={0.4} duration={1}>
                        <Card className="border-2 border-logo-navy/30 shadow-xl h-full bg-background/95 backdrop-blur-sm">
                          <CardHeader>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="p-3 rounded-xl bg-logo-navy/10">
                                <TrendingUp className="h-8 w-8 text-logo-navy" />
                              </div>
                              <CardTitle className="text-3xl md:text-4xl font-display font-bold">
                                <span className="text-gradient">
                                  {aboutContent.mission.title || 'Our Mission'}
                                </span>
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {/* Mission Image */}
                            {aboutContent.mission.image &&
                            typeof aboutContent.mission.image === 'object' &&
                            aboutContent.mission.image !== null &&
                            (aboutContent.mission.image.url || aboutContent.mission.image.filename) && (
                              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                                <Image
                                  src={
                                    aboutContent.mission.image.url
                                      ? aboutContent.mission.image.url.startsWith('http')
                                        ? aboutContent.mission.image.url
                                        : aboutContent.mission.image.url.startsWith('/')
                                          ? aboutContent.mission.image.url
                                          : `/${aboutContent.mission.image.url}`
                                      : aboutContent.mission.image.filename
                                        ? `/media/${aboutContent.mission.image.filename}`
                                        : ''
                                  }
                                  alt={aboutContent.mission.image.alt || aboutContent.mission.title || 'Mission image'}
                                  fill
                                  className="object-cover"
                                  priority={false}
                                  quality={90}
                                />
                              </div>
                            )}
                            <div className="prose prose-lg md:prose-xl max-w-none text-logo-navy">
                              {/* Display description if available, otherwise content */}
                              {aboutContent.mission.description ? (
                                typeof aboutContent.mission.description === 'string' ? (
                                  <p className="whitespace-pre-wrap leading-relaxed font-medium">
                                    {aboutContent.mission.description}
                                  </p>
                                ) : (
                                  <RichText data={aboutContent.mission.description} enableGutter={false} />
                                )
                              ) : aboutContent.mission.content ? (
                                typeof aboutContent.mission.content === 'string' ? (
                                  <p className="whitespace-pre-wrap leading-relaxed font-medium">
                                    {aboutContent.mission.content}
                                  </p>
                                ) : (
                                  <RichText data={aboutContent.mission.content} enableGutter={false} />
                                )
                              ) : null}
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    )}
                  </div>
                </CinematicReveal>
              </ParallaxElement>
            </div>
          </ScrollSection>
      </section>
      )}

      {/* Certifications */}
      {aboutContent?.certifications && aboutContent.certifications.length > 0 && (
        <ScrollSection id="certifications" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Recognition
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">Certifications</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    Our credentials and industry certifications
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {aboutContent.certifications.map((cert: any, index: number) => (
                  <Card
                    key={index}
                    className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      {cert.image &&
                        typeof cert.image === 'object' &&
                        cert.image !== null &&
                        (cert.image.url || cert.image.filename || cert.image.id) && (
                          <div className="relative h-40 mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                            <Image
                              src={
                                cert.image.url ||
                                (cert.image.filename ? `/media/${cert.image.filename}` : '')
                              }
                              alt={cert.image.alt || cert.name || 'Certification'}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                        {cert.name}
                      </CardTitle>
                    </CardHeader>
                    {cert.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium">
                          {cert.description}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Achievements */}
      {aboutContent?.achievements && aboutContent.achievements.length > 0 && (
        <ScrollSection id="achievements" fullViewport bgVariant="3" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Milestones
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">Achievements</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    Key milestones in our journey
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {aboutContent.achievements.map((achievement: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {achievement.icon &&
                          typeof achievement.icon === 'object' &&
                          achievement.icon !== null &&
                          (achievement.icon.url || achievement.icon.filename || achievement.icon.id) && (
                            <div className="relative h-20 w-20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Image
                                src={
                                  achievement.icon.url ||
                                  (achievement.icon.filename
                                    ? `/media/${achievement.icon.filename}`
                                    : '')
                                }
                                alt={achievement.icon.alt || achievement.title}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                            {achievement.title}
                          </CardTitle>
                          {achievement.value && (
                            <p className="text-3xl font-geometric font-bold text-logo-blue mt-2">
                              {achievement.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {achievement.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium">
                          {achievement.description}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Timeline */}
      {aboutContent?.timeline && aboutContent.timeline.length > 0 && (
        <ScrollSection id="timeline" flexible bgVariant="1" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    History
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">Company Timeline</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    Our journey through the years
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <div className="max-w-5xl mx-auto">
              <StaggerReveal direction="up" delay={0.3} stagger={0.2} duration={0.8}>
                <div className="space-y-6">
                  {aboutContent.timeline
                    .sort((a: any, b: any) => (b.year || 0) - (a.year || 0))
                    .map((item: any, index: number) => (
                      <Card
                        key={index}
                        className="border-l-4 border-l-logo-blue shadow-xl bg-background/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
                      >
                        <CardHeader>
                          <div className="flex gap-6 md:gap-8 items-start">
                            <div className="flex-shrink-0">
                              <div className="w-24 h-24 bg-gradient-to-br from-logo-blue to-logo-navy text-white rounded-xl flex items-center justify-center font-geometric font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {item.year}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <CardTitle className="text-2xl md:text-3xl font-display font-bold text-logo-navy mb-3">
                                {item.title}
                              </CardTitle>
                              {item.description && (
                                <CardDescription className="text-base md:text-lg text-logo-blue font-medium leading-relaxed">
                                  {item.description}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                </div>
              </StaggerReveal>
            </div>
          </div>
        </ScrollSection>
      )}

      {/* Leadership Team */}
      {aboutContent?.leadership && aboutContent.leadership.length > 0 && (
        <ScrollSection id="leadership" fullViewport bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="top-section flex flex-col lg:gap-[10px] gap-[5px] md:items-center items-start mb-16">
                  <h6 className="top-head md:text-center text-start text-sm font-semibold uppercase tracking-wider text-logo-blue mb-2">
                    OUR PEOPLE
                  </h6>
                  <h2 className="main-head md:text-center text-start text-display-large font-display font-bold tracking-tight text-logo-navy">
                    Meet the Team Driving the Vision
                  </h2>
                  <div className="sub-para md:text-center text-start lg:w-[75%] md:w-[80%] w-full">
                    <p className="text-body-large text-logo-blue max-w-3xl mx-auto md:mx-0 font-medium">
                      Built upon over 25 years of industry experience, our team actively forms trusted partnerships, fosters a culture of innovation, and relentlessly pursues excellence
                    </p>
                  </div>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <div className="people-carousel-section md:pt-5 pt-0">
              <LeadershipCarousel members={aboutContent.leadership} />
            </div>
          </div>
        </ScrollSection>
      )}

      {/* Clients */}
      {aboutContent?.clients && aboutContent.clients.length > 0 && (
        <ScrollSection id="clients" flexible bgVariant="3" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Partners
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">Our Clients</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    Trusted by leading organizations
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.6}>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-7xl mx-auto">
                {aboutContent.clients.map((client: any, index: number) => (
                  <Card
                    key={index}
                    className="text-center p-6 hover:shadow-xl transition-all duration-300 border-2 border-logo-blue/10 bg-background/95 backdrop-blur-sm group"
                  >
                    {client.logo &&
                      typeof client.logo === 'object' &&
                      client.logo !== null &&
                      (client.logo.url || client.logo.filename || client.logo.id) && (
                        <div className="relative h-28 group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src={
                              client.logo.url ||
                              (client.logo.filename ? `/media/${client.logo.filename}` : '')
                            }
                            alt={client.logo.alt || 'Client logo'}
                            fill
                            className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Testimonials */}
      {aboutContent?.testimonials && aboutContent.testimonials.length > 0 && (
        <ScrollSection id="testimonials" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Testimonials
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">What Our Clients Say</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    Trusted feedback from our partners
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {aboutContent.testimonials.map((testimonial: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {testimonial.image &&
                          typeof testimonial.image === 'object' &&
                          testimonial.image !== null &&
                          (testimonial.image.url || testimonial.image.filename || testimonial.image.id) && (
                            <div className="relative h-16 w-16 flex-shrink-0 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300 border-2 border-logo-blue/20">
                              <Image
                                src={
                                  testimonial.image.url ||
                                  (testimonial.image.filename ? `/media/${testimonial.image.filename}` : '')
                                }
                                alt={testimonial.image.alt || testimonial.name || 'Client'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        <div className="flex-1">
                          <CardTitle className="text-xl font-display font-bold text-logo-navy">
                            {testimonial.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    {testimonial.review && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {testimonial.review}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Strengths */}
      {aboutContent?.strengths && aboutContent.strengths.length > 0 && (
        <ScrollSection id="strengths" fullViewport bgVariant="gradient" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    Advantages
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight">
                    <span className="text-gradient">Our Strengths</span>
                  </h2>
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    What sets us apart
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {aboutContent.strengths.map((strength: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {strength.icon &&
                          typeof strength.icon === 'object' &&
                          strength.icon !== null &&
                          (strength.icon.url || strength.icon.filename || strength.icon.id) && (
                            <div className="relative h-20 w-20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Image
                                src={
                                  strength.icon.url ||
                                  (strength.icon.filename ? `/media/${strength.icon.filename}` : '')
                                }
                                alt={strength.icon.alt || strength.title}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                            {strength.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    {strength.description && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {strength.description}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            mainEntity: {
              '@type': 'Organization',
              name: siteSettings?.siteName || 'Shamal Technologies',
              description: aboutContent?.hero?.description || siteSettings?.siteDescription,
            },
          }),
        }}
      />
    </main>
  )
}
