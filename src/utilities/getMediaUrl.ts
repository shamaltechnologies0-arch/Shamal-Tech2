import { getClientSideURL } from './getURL'
import { toCdnMediaUrl } from '../lib/backup/s3'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const cdnUrl = toCdnMediaUrl(url)
    // Payload stamps localhost into file URLs from NEXT_PUBLIC_SERVER_URL. Keep those
    // root-relative so the image loads from whichever host is actually serving the page.
    try {
      const parsed = new URL(cdnUrl)
      const isLoopback = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
      if (isLoopback && parsed.pathname.startsWith('/api/media/')) {
        const relative = `${parsed.pathname}${parsed.search}`
        return cacheTag ? `${relative}?${cacheTag}` : relative
      }
    } catch {
      // Keep the original URL when it cannot be parsed.
    }
    return cacheTag ? `${cdnUrl}?${cacheTag}` : cdnUrl
  }

  // Otherwise prepend client-side URL
  const baseUrl = getClientSideURL()
  return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`
}
