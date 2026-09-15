import { getServerSideURL } from '../../utilities/getURL'
import { renderSitemapIndex } from '../../lib/seo/sitemapXml'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  const siteUrl = getServerSideURL().replace(/\/$/, '')
  const xml = renderSitemapIndex([
    `${siteUrl}/pages-sitemap.xml`,
    `${siteUrl}/posts-sitemap.xml`,
    `${siteUrl}/services-sitemap.xml`,
    `${siteUrl}/products-sitemap.xml`,
    `${siteUrl}/employees-sitemap.xml`,
  ])

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}
