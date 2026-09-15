function getSiteURL() {
  const raw =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://shamal.sa'
  const trimmed = String(raw).trim()
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return withProtocol.replace(/\/$/, '')
}

const SITE_URL = getSiteURL()

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*', '/next/*', '/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
}
