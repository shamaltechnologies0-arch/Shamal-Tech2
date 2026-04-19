/**
 * Vimeo: build embed player URLs. Private videos should use VIMEO_ACCESS_TOKEN
 * server-side to fetch the correct embed privacy hash when needed.
 */

import { getVimeoAccessToken } from './env'

type VimeoVideoResponse = {
  embed?: { html?: string }
  player_embed_url?: string
}

export function publicEmbedUrl(vimeoNumericId: string): string {
  return `https://player.vimeo.com/video/${vimeoNumericId}`
}

/**
 * For paid/private assets, optionally enrich from Vimeo API (requires token).
 * Falls back to public player URL if API is unavailable.
 */
export async function resolvePaidEmbedUrl(vimeoNumericId: string): Promise<string> {
  const token = getVimeoAccessToken()
  if (!token) {
    return publicEmbedUrl(vimeoNumericId)
  }
  try {
    const res = await fetch(`https://api.vimeo.com/videos/${vimeoNumericId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      },
      next: { revalidate: 300 },
    })
    if (!res.ok) return publicEmbedUrl(vimeoNumericId)
    const data = (await res.json()) as VimeoVideoResponse
    if (data.player_embed_url) return data.player_embed_url
  } catch {
    // fall through
  }
  return publicEmbedUrl(vimeoNumericId)
}
