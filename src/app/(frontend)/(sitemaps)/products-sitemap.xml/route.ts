import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'

import { getServerSideURL } from '../../../../utilities/getURL'
import { expandSitemapWithArabic } from '../../../../lib/seo/sitemapLocales'
import { renderSitemapUrlSet, withSitemapHreflang } from '../../../../lib/seo/sitemapXml'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    limit: 1000,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const baseUrl = getServerSideURL()
  const entries = expandSitemapWithArabic(
    [
      {
        loc: `${baseUrl}/products`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.9,
      },
      ...products.docs.map((product) => ({
        loc: `${baseUrl}/products/${product.slug}`,
        lastmod: new Date(product.updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      })),
    ],
    baseUrl,
  ).map((entry) => withSitemapHreflang(entry, baseUrl))

  return new Response(renderSitemapUrlSet(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}
