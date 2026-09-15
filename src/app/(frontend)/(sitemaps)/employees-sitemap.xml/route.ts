import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { getServerSideURL } from '@/utilities/getURL'
import { expandSitemapWithArabic } from '@/lib/seo/sitemapLocales'
import { renderSitemapUrlSet, withSitemapHreflang } from '@/lib/seo/sitemapXml'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const employees = await payload.find({
    collection: 'employees',
    limit: 1000,
    where: {
      status: {
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
    employees.docs.map((emp) => ({
      loc: `${baseUrl}/profile/${(emp as { slug: string }).slug}`,
      lastmod: new Date((emp as { updatedAt: string }).updatedAt).toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.7,
    })),
    baseUrl,
  ).map((entry) => withSitemapHreflang(entry, baseUrl))

  return new Response(renderSitemapUrlSet(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}
