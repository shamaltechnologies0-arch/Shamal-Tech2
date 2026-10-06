import { getClientSideURL } from './getURL'
import { toCdnMediaUrl } from '../lib/backup/s3'

const MEDIA_FILE_PATH = '/api/media/file/'

/**
 * Public S3 address for media files. The Payload file route on the live site
 * returns an error for these objects, so images are loaded from storage directly.
 */
function publicMediaBase(): string {
  const configured =
    process.env.NEXT_PUBLIC_S3_PUBLIC_URL ||
    process.env.S3_CDN_URL ||
    process.env.NEXT_PUBLIC_CDN_URL
  if (configured) return configured.replace(/\/$/, '')

  const bucket = process.env.S3_BUCKET || process.env.NEXT_PUBLIC_S3_BUCKET
  const region = process.env.S3_REGION || process.env.NEXT_PUBLIC_S3_REGION
  if (bucket && region) return `https://${bucket}.s3.${region}.amazonaws.com`

  return 'https://shamal-media.s3.me-central-1.amazonaws.com'
}

/** Turn a Payload `/api/media/file/...` URL into the public storage URL. */
export function toPublicMediaFileUrl(url: string): string | null {
  const pathOnly = url.startsWith('http://') || url.startsWith('https://')
    ? (() => {
        try {
          return new URL(url).pathname
        } catch {
          return ''
        }
      })()
    : url.split('?')[0]

  const index = pathOnly.indexOf(MEDIA_FILE_PATH)
  if (index === -1) return null

  const filename = decodeURIComponent(pathOnly.slice(index + MEDIA_FILE_PATH.length)).replace(/^\/+/, '')
  if (!filename || filename.includes('..')) return null

  return `${publicMediaBase()}/${filename.split('/').map((part) => encodeURIComponent(part)).join('/')}`
}

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

  const stored = toPublicMediaFileUrl(url)
  if (stored) {
    const cdnUrl = toCdnMediaUrl(stored)
    return cacheTag ? `${cdnUrl}?${cacheTag}` : cdnUrl
  }

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const cdnUrl = toCdnMediaUrl(url)
    return cacheTag ? `${cdnUrl}?${cacheTag}` : cdnUrl
  }

  // Otherwise prepend client-side URL
  const baseUrl = getClientSideURL()
  return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`
}
