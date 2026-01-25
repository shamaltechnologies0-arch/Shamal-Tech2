import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { Badge } from '../../../components/ui/badge'
import { ProductsClient } from './ProductsClient'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { CinematicReveal } from '../../../utilities/animations'
import { getCachedGlobal } from '../../../utilities/getGlobals'

export async function generateMetadata(): Promise<Metadata> {
  const productsPageContent = (await getCachedGlobal('products-page-content', 2)()) as {
    hero?: {
      title?: string
      subtitle?: string
    }
    seo?: {
      metaTitle?: string
      metaDescription?: string
      ogImage?: {
        url?: string
        alt?: string
      } | null
    }
  } | null

  return {
    title: productsPageContent?.seo?.metaTitle || productsPageContent?.hero?.title || 'Products | Shamal Technologies',
    description: productsPageContent?.seo?.metaDescription || productsPageContent?.hero?.subtitle || 'Professional-grade drone equipment, sensors, and geospatial technology products for sale or lease. Browse our range of DJI drones, payloads, and satellite imagery solutions.',
  }
}

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch products page content from global
  const productsPageContent = (await getCachedGlobal('products-page-content', 3)()) as {
    hero?: {
      title?: string
      subtitle?: string
      backgroundImage?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
    }
    seo?: {
      metaTitle?: string
      metaDescription?: string
      ogImage?: {
        url?: string
        alt?: string
      } | null
    }
  } | null

  const products = await payload.find({
    collection: 'products',
    limit: 100,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-featured',
  })

  // Group products by category
  const productsByCategory = {
    drones: products.docs.filter((p) => p.category === 'drones'),
    payloads: products.docs.filter((p) => p.category === 'payloads'),
    other: products.docs.filter((p) => p.category === 'other'),
  }

  // Get hero content from CMS or use defaults
  const heroTitle = productsPageContent?.hero?.title || 'Our Products'
  const heroSubtitle = productsPageContent?.hero?.subtitle || 'Professional-grade drone equipment, sensors, and geospatial technology products for sale or lease'
  const heroBackgroundImage = productsPageContent?.hero?.backgroundImage

  return (
    <main className="flex flex-col relative">
      {/* Hero Section - Reduced Height */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        {/* Background Image */}
        {heroBackgroundImage &&
        typeof heroBackgroundImage === 'object' &&
        heroBackgroundImage !== null &&
        (heroBackgroundImage.url || heroBackgroundImage.filename) && (
          <div className="absolute inset-0 z-0">
            <Image
              src={
                heroBackgroundImage.url
                  ? heroBackgroundImage.url.startsWith('http')
                    ? heroBackgroundImage.url
                    : heroBackgroundImage.url.startsWith('/')
                      ? heroBackgroundImage.url
                      : `/${heroBackgroundImage.url}`
                  : heroBackgroundImage.filename
                    ? `/media/${heroBackgroundImage.filename}`
                    : ''
              }
              alt={heroBackgroundImage.alt || 'Products page hero background'}
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.1} duration={1.2}>
            <div className="container mx-auto px-4 w-full relative z-10">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge
                  variant="outline"
                  className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
                >
                  Products
                </Badge>
                <h1 className="text-hero font-display font-bold tracking-tight text-white drop-shadow-2xl">
                  {heroTitle}
                </h1>
                {heroSubtitle && (
                  <p className="text-body-large text-white/95 max-w-3xl mx-auto font-medium drop-shadow-lg">
                    {heroSubtitle}
                </p>
                )}
              </div>
            </div>
          </CinematicReveal>
        </ParallaxElement>
      </ScrollSection>

      {/* Category Tabs and Products - Flexible Height */}
      <ScrollSection id="products" flexible bgVariant="1" parallax>
        <div className="container mx-auto px-4 w-full">
          <ProductsClient
            productsByCategory={productsByCategory}
            allProducts={products.docs}
          />
        </div>
      </ScrollSection>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Our Products',
            itemListElement: products.docs.map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: product.name,
                description: product.seo?.description || '',
                category: product.category,
              },
            })),
          }),
        }}
      />
    </main>
  )
}
