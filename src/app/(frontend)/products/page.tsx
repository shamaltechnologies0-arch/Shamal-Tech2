import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { ProductsPageHero } from '../../../components/sections/ProductsPageHero.client'
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
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      subtitle?: string
      subtitleAr?: string
      backgroundImage?: {
        id?: string
        url?: string
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

  const heroBackgroundImage = productsPageContent?.hero?.backgroundImage

  return (
    <main className="flex flex-col relative">
      {/* Hero Section - Reduced Height */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        {/* Background Image */}
        {/* Use only the URL from the API (S3 in production — do not use local /media/ paths) */}
        {heroBackgroundImage &&
        typeof heroBackgroundImage === 'object' &&
        heroBackgroundImage !== null &&
        heroBackgroundImage.url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={
                heroBackgroundImage.url.startsWith('http')
                  ? heroBackgroundImage.url
                  : heroBackgroundImage.url.startsWith('/')
                    ? heroBackgroundImage.url
                    : `/${heroBackgroundImage.url}`
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
            <ProductsPageHero
              badge={productsPageContent?.hero?.badge}
              badgeAr={productsPageContent?.hero?.badgeAr}
              title={productsPageContent?.hero?.title}
              titleAr={productsPageContent?.hero?.titleAr}
              subtitle={productsPageContent?.hero?.subtitle}
              subtitleAr={productsPageContent?.hero?.subtitleAr}
            />
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
