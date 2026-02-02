import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import { getCachedGlobal } from '../../utilities/getGlobals'
import { generateMeta } from '../../utilities/generateMeta'
import { LivePreviewListener } from '../../components/LivePreviewListener'
import { safePayloadFind } from '../../utilities/safePayloadQuery'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { ArrowRight, Check, CheckCircle2, TrendingUp, Award, Users, Target } from 'lucide-react'
import { ServicesCarousel } from '../../components/sections/ServicesCarousel.client'
import { serializeServices } from '../../utilities/serializeService'
import { ScrollReveal, StaggerReveal, CinematicReveal } from '../../utilities/animations'
import { SectorsPinnedSection } from '../../components/sections/SectorsPinnedSection.client'
import { Media } from '../../components/Media'
import RichText from '../../components/RichText'
import { HeroSection } from '../../components/sections/HeroSection.client'
import { HeroEnhanced } from '../../components/sections/HeroEnhanced.client'
import { ScrollSection } from '../../components/sections/ScrollSection'
import { ParallaxElement } from '../../components/sections/ParallaxElement'
import { ScrollIndicator } from '../../components/sections/ScrollIndicator'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter.client'
import { LogoSlider } from '../../components/sections/LogoSlider.client'
import { SlidingServicesSection } from '../../components/sections/SlidingServicesSection.client'

export const metadata: Metadata = {
  title: 'Shamal Technologies | Drone Survey & Geospatial Solutions in Saudi Arabia',
  description:
    'Pioneering provider of drone and geospatial solutions in Saudi Arabia. Expert drone survey and geospatial services for construction, infrastructure, mining, agriculture, and environmental sectors.',
}

// ISR: Regenerate homepage every hour (3600 seconds)
// On-demand revalidation hooks still work for immediate updates when content changes
export const revalidate = 3600

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()

  // Fetch homepage content with type assertions - depth 3 to ensure media relationships are fully populated
  const homepageContent = (await getCachedGlobal('homepage-content', 3)()) as {
    hero?: {
      title?: string
      subtitle?: string
      backgroundImage?: any
    }
    servicesOverview?: {
      title?: string
      description?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
    }
    sectors?: {
      title?: string
      description?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
      selectedSectors?: Array<{
        sectorSlug?: string
        id?: string
      }>
    }
    aboutPreview?: {
      title?: string
      description?: string
      imageColumn?: {
        id?: string
        url?: string
        alt?: string
        mimeType?: string
        filename?: string
        updatedAt?: string
        createdAt?: string
      } | string | null
      textColumn?: any
      enableTwoColumn?: boolean
      leftColumnMedia?: {
        id?: string
        url?: string
        alt?: string
        mimeType?: string
      } | string | null
      rightColumnTextBlocks?: Array<{
        textType?: 'heading' | 'paragraph' | 'bullets'
        heading?: string
        headingLevel?: 'h2' | 'h3' | 'h4'
        paragraph?: string
        bullets?: Array<{
          text?: string
        }>
      }>
      ctaText?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
    }
    blogPreview?: {
      title?: string
      description?: string
      ctaText?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
      featuredPosts?: Array<{
        post?: string | {
          id?: string
          slug?: string
          title?: string
          date?: string
          description?: string
          featuredImage?: {
            url?: string
            alt?: string
          } | null
        }
        customImage?: {
          url?: string
          alt?: string
        } | null
      }>
    }
    contactCTA?: {
      title?: string
      description?: string
      ctaText?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
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

  // Fetch services for carousel - always use published, never drafts
  // Sort by order field (ascending), then by createdAt as fallback
  const servicesResult = await safePayloadFind({
    collection: 'services',
    limit: 100, // Fetch all services to respect ordering
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: 'order', // Sort by admin-controlled order field
    depth: 2, // Ensure relationships (like heroImage) are populated
    draft: false, // Explicitly exclude drafts
    overrideAccess: false, // Respect access control
  })

  // Ensure proper sorting: services with order field first (ascending), then by createdAt
  // This handles cases where order might be null/undefined
  const services = {
    ...servicesResult,
    docs: [...servicesResult.docs].sort((a, b) => {
      const orderA = a.order ?? 999
      const orderB = b.order ?? 999
      if (orderA !== orderB) {
        return orderA - orderB
      }
      // If order is the same, sort by createdAt (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }),
  }

  // Fetch about content for client logos
  const aboutContent = (await getCachedGlobal('about-page-content', 2)()) as {
    clients?: Array<{
      logo?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
      } | string | null
    }>
  } | null

  // Fetch sectors with type assertion - depth 3 to ensure all relationships are populated
  const sectorsContent = (await getCachedGlobal('sectors-content', 3)()) as {
    sectors?: Array<{
      name?: string
      slug?: string
      description?: string
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
      ctaBlog?: string
      ctaContact?: string
      useCases?: Array<{
        title?: string
        description?: string
        id?: string
      }>
      solutionsDelivered?: Array<{
        title?: string
        description?: string
        id?: string
      }>
    }>
  } | null

  // Filter and order sectors based on homepage selection
  let orderedSectors = sectorsContent?.sectors || []
  if (homepageContent?.sectors?.selectedSectors && homepageContent.sectors.selectedSectors.length > 0) {
    // Create a map of sectors by slug for quick lookup (case-insensitive)
    const sectorsMap = new Map(
      (sectorsContent?.sectors || []).map((sector) => [
        sector.slug?.toLowerCase().trim() || '',
        sector,
      ])
    )
    
    // Order sectors according to selectedSectors array
    orderedSectors = homepageContent.sectors.selectedSectors
      .map((selected) => {
        const slug = selected.sectorSlug?.toLowerCase().trim() || ''
        const sector = sectorsMap.get(slug)
        return sector
      })
      .filter((sector) => sector !== undefined) as typeof orderedSectors
    
    // If no sectors matched, fall back to all sectors
    if (orderedSectors.length === 0) {
      orderedSectors = sectorsContent?.sectors || []
    }
  }

  // Determine which blog posts to show
  // If featuredPosts are set in homepageContent, use those; otherwise use latest published posts
  const featuredPostsFromCMS = homepageContent?.blogPreview?.featuredPosts
  let blogPostsToDisplay: any[] = []

  if (featuredPostsFromCMS && Array.isArray(featuredPostsFromCMS) && featuredPostsFromCMS.length > 0) {
    // Use featured posts from CMS
    // Fetch full post data for each featured post
    const postIds = featuredPostsFromCMS
      .map((item) => {
        if (typeof item.post === 'object' && item.post !== null && 'id' in item.post) {
          return item.post.id
        } else if (typeof item.post === 'string') {
          return item.post
        }
        return null
      })
      .filter((id) => id !== null)

    if (postIds.length > 0) {
      const fetchedPosts = await safePayloadFind({
        collection: 'posts',
        where: {
          id: {
            in: postIds as string[],
          },
        },
        depth: 2,
        draft: false,
        overrideAccess: false,
      })

      // Map posts with their custom images
      blogPostsToDisplay = fetchedPosts.docs.map((post) => {
        const featuredItem = featuredPostsFromCMS.find(
          (item) =>
            (typeof item.post === 'object' && item.post !== null && 'id' in item.post
              ? item.post.id
              : item.post) === post.id
        )
        return {
          ...post,
          customImage: featuredItem?.customImage || null,
        }
      })
    }
  }

  // Fallback to latest published posts if no featured posts
  if (blogPostsToDisplay.length === 0) {
    const blogPosts = await safePayloadFind({
      collection: 'posts',
      limit: 3,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
      depth: 2,
      draft: false,
      overrideAccess: false,
    })
    blogPostsToDisplay = blogPosts.docs.map((post) => ({
      ...post,
      customImage: null,
    }))
  }

  // Define sections for scroll indicator
  const sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'stats', label: 'Impact' },
    { id: 'services', label: 'Services' },
    { id: 'sectors', label: 'Sectors' },
    { id: 'about', label: 'About' },
    { id: 'blog', label: 'Insights' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <main className="flex flex-col relative">
      {draft && <LivePreviewListener />}
      
      {/* Scroll Indicator */}
      <ScrollIndicator sections={sections} />

      {/* Hero Section - Enhanced with Motion Overlays */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background - Keep existing video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ minHeight: '100%', minWidth: '100%' }}
          >
            <source src="/media/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Enhanced gradient overlay for better text readability and cinematic depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>
        
        {/* Motion Overlays - Subtle abstract shapes */}
        <HeroEnhanced>
          {/* Hero Text with Enhanced Typography */}
          <div className="relative z-10 container mx-auto px-4 py-20 w-full">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <CinematicReveal delay={0.2} duration={1.5}>
                <h1 className="text-hero font-display font-bold tracking-tight text-white drop-shadow-2xl">
                  {homepageContent?.hero?.title?.replace(/^Heading Text - /i, '') || 'Shamal Technologies'}
                </h1>
              </CinematicReveal>
              {homepageContent?.hero?.subtitle && (
                <CinematicReveal delay={0.4} duration={1.2}>
                  <p className="text-body-large text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                    {homepageContent.hero.subtitle}
                  </p>
                </CinematicReveal>
              )}
            </div>
          </div>
        </HeroEnhanced>
      </section>

      {/* Dynamic Sliding Services Section */}
      {services.docs.length > 0 && (
        <SlidingServicesSection
          services={services.docs.map((service) => ({
            id: String(service.id),
            title: service.title || null,
            slug: service.slug || null,
          }))}
        />
      )}

      {/* Client Logos Slider - Automatic Scrolling */}
      {aboutContent?.clients && aboutContent.clients.length > 0 && (
        <LogoSlider
          logos={aboutContent.clients
            .map((client) => {
              if (
                client.logo &&
                typeof client.logo === 'object' &&
                client.logo !== null &&
                (client.logo.url || client.logo.filename)
              ) {
                return {
                  id: client.logo.id || `client-${client.logo.id}`,
                  url: client.logo.url,
                  filename: client.logo.filename,
                  alt: client.logo.alt || 'Client logo',
                }
              }
              return null
            })
            .filter((logo): logo is NonNullable<typeof logo> => logo !== null)}
        />
      )}

      {/* Stats Section - Full Viewport Immersive */}
      <ScrollSection id="stats" fullViewport bgVariant="2" className="border-y border-logo-blue/20 surface-neutral">
        <div className="container mx-auto px-4 w-full">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.1} duration={1.2} scale>
              <div className="text-center mb-16 space-y-6">
                <Badge variant="outline" className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold">
                  Our Impact
                </Badge>
                <h2 className="text-display-large font-display font-bold text-foreground">
                  Delivering Excellence Across Industries
                </h2>
              </div>
            </CinematicReveal>
          </ParallaxElement>
          <StaggerReveal direction="up" delay={0.3} stagger={0.2} duration={1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
              <div className="text-center space-y-4 group">
                <div className="text-6xl md:text-7xl lg:text-8xl font-geometric font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter value={500} duration={2000} suffix="+" />
                </div>
                <div className="text-base md:text-lg text-logo-navy font-semibold">
                  Projects Completed
                </div>
              </div>
              <div className="text-center space-y-4 group">
                <div className="text-6xl md:text-7xl lg:text-8xl font-geometric font-bold text-logo-navy group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter value={80} duration={2000} suffix="+" />
                </div>
                <div className="text-base md:text-lg text-logo-blue font-semibold">
                  Expert Team
                </div>
              </div>
              <div className="text-center space-y-4 group">
                <div className="text-6xl md:text-7xl lg:text-8xl font-geometric font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter value={11} duration={2000} />
                </div>
                <div className="text-base md:text-lg text-logo-navy font-semibold">
                  Sectors Served
                </div>
              </div>
              <div className="text-center space-y-4 group">
                <div className="text-6xl md:text-7xl lg:text-8xl font-geometric font-bold text-logo-navy group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter value={100} duration={2000} suffix="%" />
                </div>
                <div className="text-base md:text-lg text-logo-blue font-semibold">
                  Client Satisfaction
                </div>
              </div>
            </div>
          </StaggerReveal>
        </div>
      </ScrollSection>

      {/* Services Overview Section - Scrollable Carousel with Parallax */}
      <ScrollSection id="services" flexible bgVariant="1" parallax>
        {/* Background Image */}
        {homepageContent?.servicesOverview?.backgroundImage &&
          typeof homepageContent.servicesOverview.backgroundImage === 'object' &&
          'url' in homepageContent.servicesOverview.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={homepageContent.servicesOverview.backgroundImage.url as string}
                alt={
                  (homepageContent.servicesOverview.backgroundImage as any).alt ||
                  'Services background'
                }
                fill
                className="object-cover opacity-20"
                priority={false}
                quality={85}
              />
              <div className="absolute inset-0 bg-background/80" />
            </div>
          )}
        <div className="container mx-auto px-4 relative z-10">
          <ParallaxElement speed={0.3} direction="up">
            <CinematicReveal delay={0.2} duration={1.2}>
              <div className="text-center mb-16 space-y-6">
                <Badge variant="outline" className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold">
                  Our Services
                </Badge>
                <h2 className="text-display-large font-display font-bold tracking-tight text-foreground">
                  <span className="text-gradient">
                    {homepageContent?.servicesOverview?.title || 'Comprehensive Solutions'}
                  </span>
                </h2>
                {homepageContent?.servicesOverview?.description && (
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    {homepageContent.servicesOverview.description}
                  </p>
                )}
              </div>
            </CinematicReveal>
          </ParallaxElement>
          <ScrollReveal direction="up" delay={0.3} duration={1}>
            <ServicesCarousel services={serializeServices(services.docs)} />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4} duration={1}>
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-logo-navy text-logo-navy hover:bg-logo-navy hover:text-white"
            >
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          </ScrollReveal>
        </div>
      </ScrollSection>

      {/* Sectors We Serve Section - Pinned/Sticky Layout */}
      <div id="sectors">
        <SectorsPinnedSection
        title={homepageContent?.sectors?.title || 'SECTORS WE SERVE'}
        description={homepageContent?.sectors?.description}
        sectors={orderedSectors}
        backgroundImage={
          homepageContent?.sectors?.backgroundImage &&
          typeof homepageContent.sectors.backgroundImage === 'object' &&
          homepageContent.sectors.backgroundImage !== null
            ? (() => {
                const bgImg = homepageContent.sectors.backgroundImage as any
                // PayloadCMS upload fields have 'url' property when populated with depth > 0
                const url = bgImg?.url
                return url && typeof url === 'string'
                  ? {
                      url: url,
                      alt: bgImg?.alt || bgImg?.altText || 'Sectors We Serve Background',
                    }
                  : undefined
              })()
            : undefined
        }
        />
      </div>

      {/* About Preview Section - Full Viewport with Parallax */}
      <ScrollSection id="about" fullViewport bgVariant="3" parallax>
        {/* Background Image */}
        {homepageContent?.aboutPreview?.backgroundImage &&
          typeof homepageContent.aboutPreview.backgroundImage === 'object' &&
          'url' in homepageContent.aboutPreview.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={homepageContent.aboutPreview.backgroundImage.url as string}
                alt={
                  (homepageContent.aboutPreview.backgroundImage as any).alt ||
                  'About preview background'
                }
                fill
                className="object-cover opacity-20"
                priority={false}
                quality={85}
              />
              <div className="absolute inset-0 bg-background/80" />
            </div>
          )}
        <div className="container mx-auto px-4 relative z-10">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.2} duration={1.2}>
              <div className="max-w-7xl mx-auto space-y-12">
                {/* Heading */}
                <div className="text-center space-y-6">
                  <Badge variant="outline" className="w-fit mx-auto border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 mt-20 text-sm font-semibold">
                    Who We Are?
                  </Badge>
                  <h2 className="text-display-large font-display font-bold tracking-tight text-foreground">
                    <span className="text-gradient">
                      {homepageContent?.aboutPreview?.title || 'About Shamal Technologies'}
                    </span>
                  </h2>
                  {homepageContent?.aboutPreview?.description && (
                    <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                      {homepageContent.aboutPreview.description}
                    </p>
                  )}
                </div>

              {/* Image and Text Columns (below description) */}
              {(homepageContent?.aboutPreview?.imageColumn ||
                homepageContent?.aboutPreview?.textColumn) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-12">
                  {/* Image Column */}
                  {homepageContent.aboutPreview.imageColumn && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted shadow-lg">
                      {typeof homepageContent.aboutPreview.imageColumn === 'object' &&
                      homepageContent.aboutPreview.imageColumn !== null &&
                      (homepageContent.aboutPreview.imageColumn.url ||
                        homepageContent.aboutPreview.imageColumn.filename ||
                        homepageContent.aboutPreview.imageColumn.id) ? (
                        <Media
                          resource={homepageContent.aboutPreview.imageColumn as any}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover"
                          videoClassName="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No media selected
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Column */}
                  {homepageContent.aboutPreview.textColumn && (
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <RichText
                        data={homepageContent.aboutPreview.textColumn}
                        enableGutter={false}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* CTA Button */}
              <div className="text-center pt-8">
                <Button asChild size="lg" className="bg-logo-blue hover:bg-logo-blue/90">
                  <Link href="/about">
                    {homepageContent?.aboutPreview?.ctaText || 'Learn More About Us'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CinematicReveal>
          </ParallaxElement>
        </div>
      </ScrollSection>

      {/* Blog Preview Section - Full Viewport Insights */}
      <ScrollSection id="blog" fullViewport bgVariant="1" parallax>
        {/* Background Image */}
        {homepageContent?.blogPreview?.backgroundImage &&
          typeof homepageContent.blogPreview.backgroundImage === 'object' &&
          'url' in homepageContent.blogPreview.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={homepageContent.blogPreview.backgroundImage.url as string}
                alt={
                  (homepageContent.blogPreview.backgroundImage as any).alt ||
                  'Blog preview background'
                }
                fill
                className="object-cover opacity-20"
                priority={false}
                quality={85}
              />
              <div className="absolute inset-0 bg-background/80" />
            </div>
          )}
        <div className="container mx-auto px-4 relative z-10">
          <ParallaxElement speed={0.3} direction="up">
            <CinematicReveal delay={0.2} duration={1.2}>
              <div className="text-center mb-16 space-y-6">
                <Badge variant="outline" className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold">
                  Insights
                </Badge>
                <h2 className="text-display-large font-display font-bold tracking-tight text-foreground">
                  <span className="text-gradient">
                    {homepageContent?.blogPreview?.title || 'Latest Insights'}
                  </span>
                </h2>
                {homepageContent?.blogPreview?.description && (
                  <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    {homepageContent.blogPreview.description}
                  </p>
                )}
              </div>
            </CinematicReveal>
          </ParallaxElement>
          <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.8}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPostsToDisplay.map((post: any, index: number) => {
                // Determine which image to use: customImage from CMS or post's featuredImage
                const displayImage =
                  post.customImage &&
                  typeof post.customImage === 'object' &&
                  'url' in post.customImage
                    ? post.customImage
                    : post.featuredImage &&
                      typeof post.featuredImage === 'object' &&
                      'url' in post.featuredImage
                    ? post.featuredImage
                    : null

                return (
                  <Card key={post.id || index} className="group hover:shadow-lg transition-shadow overflow-hidden">
                <Link href={`/posts/${post.slug}`} className="block">
                      {displayImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                            src={displayImage.url as string}
                            alt={post.title || 'Blog post'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                  <CardHeader>
                    {post.date && (
                      <CardDescription>
                        {new Date(post.date as string).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    )}
                    <CardTitle className="text-xl group-hover:text-logo-blue transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  {post.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
                    </CardContent>
                  )}
                </Link>
              </Card>
                )
              })}
          </div>
          </StaggerReveal>
          <ScrollReveal direction="up" delay={0.4} duration={1}>
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-logo-navy text-logo-navy hover:bg-logo-navy hover:text-white"
            >
              <Link href="/posts">
                {homepageContent?.blogPreview?.ctaText || 'Read All Posts'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          </ScrollReveal>
        </div>
      </ScrollSection>

      {/* Contact CTA Section - Full Viewport Final CTA */}
      <ScrollSection id="contact" fullViewport bgVariant="gradient" parallax>
        {/* Background Image */}
        {homepageContent?.contactCTA?.backgroundImage &&
          typeof homepageContent.contactCTA.backgroundImage === 'object' &&
          'url' in homepageContent.contactCTA.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={homepageContent.contactCTA.backgroundImage.url as string}
                alt={
                  (homepageContent.contactCTA.backgroundImage as any).alt ||
                  'Contact CTA background'
                }
                fill
                className="object-cover opacity-20"
                priority={false}
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-logo-blue/20 via-logo-navy/10 to-background/80" />
            </div>
          )}
        <div className="container mx-auto px-4 relative z-10 w-full">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.2} duration={1.2} scale>
              <Card className="max-w-4xl mx-auto border-2 border-logo-blue/30 shadow-2xl bg-background/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-6">
                  <Badge variant="outline" className="w-fit mx-auto border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold">
                    Get In Touch
                  </Badge>
                  <CardTitle className="text-display-large font-display font-bold text-foreground">
                    <span className="text-gradient">
                      {homepageContent?.contactCTA?.title || 'Ready to Get Started?'}
                    </span>
                  </CardTitle>
                  {homepageContent?.contactCTA?.description && (
                    <CardDescription className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                      {homepageContent.contactCTA.description}
                    </CardDescription>
                  )}
                </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="text-base px-8 h-14 bg-logo-blue hover:bg-logo-blue/90">
                    <Link href="/contact">
                      Contact Us Today
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-base px-8 h-14 border-2 border-logo-navy text-logo-navy hover:bg-logo-navy hover:text-white"
                  >
                    <Link href="/services">Explore Services</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CinematicReveal>
          </ParallaxElement>
        </div>
      </ScrollSection>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteSettings?.siteName || 'Shamal Technologies',
            description:
              siteSettings?.siteDescription ||
              'Pioneering provider of drone and geospatial solutions in Saudi Arabia',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shamal.sa',
            logo:
              siteSettings?.logo &&
              typeof siteSettings.logo === 'object' &&
              'url' in siteSettings.logo
                ? siteSettings.logo.url
                : undefined,
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: siteSettings?.contactInfo?.phone || '+966 (0) 53 030 1370',
              contactType: 'Customer Service',
              email: siteSettings?.contactInfo?.email || 'hello@shamal.sa',
            },
            address: {
              '@type': 'PostalAddress',
              streetAddress: siteSettings?.contactInfo?.address || '11th floor, Office no:1109',
              addressLocality: 'Jeddah',
              addressRegion: 'Makkah',
              postalCode: '23511',
              addressCountry: 'SA',
            },
          }),
        }}
      />
    </main>
  )
}
