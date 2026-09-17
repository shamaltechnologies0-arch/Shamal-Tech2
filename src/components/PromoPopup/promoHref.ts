const CTA_ALIASES: Record<string, string> = {
  training: '/training',
  '/training/': '/training',
  academy: '/training',
  'shamal academy': '/training',
  'training platform': '/training',
  'join training': '/training',
  products: '/products',
  product: '/products',
  '/products/': '/products',
  shop: '/products',
  'dji products': '/products',
  'buy products': '/products',
}

export function isExternalPromoHref(href: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(href)
}

export function normalizePromoHref(raw: string | null | undefined, fallback: string): string {
  const value = (raw || '').trim()
  if (!value) return fallback

  const alias = CTA_ALIASES[value.toLowerCase()]
  if (alias) return alias

  if (/^(mailto:|tel:|#)/i.test(value)) return value

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      const host = url.hostname.replace(/^www\./, '').toLowerCase()
      const isOwnSite =
        host === 'localhost' ||
        host.endsWith('shamal.sa') ||
        host.includes('shamal')
      if (isOwnSite) {
        const path = `${url.pathname}${url.search}${url.hash}`
        return path && path !== '/' ? path : fallback
      }
      return value
    } catch {
      return fallback
    }
  }

  if (!value.startsWith('/')) {
    return `/${value.replace(/^\.\//, '').replace(/^\/+/, '')}`
  }

  return value.replace(/\/{2,}/g, '/')
}
