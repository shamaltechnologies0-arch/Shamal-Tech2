/** Normalized traffic buckets for reporting (Block D). */
export type TrafficBucket =
  | 'google_organic'
  | 'direct'
  | 'social'
  | 'whatsapp'
  | 'facebook_ads'
  | 'instagram'
  | 'referral'
  | 'unknown'

function hostFromUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return ''
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

export function classifyTrafficSource(referrerUrl: string | null | undefined, pageUrl?: string): TrafficBucket {
  const ref = referrerUrl?.trim() || ''
  const refHost = hostFromUrl(ref)
  const pageHost = pageUrl ? hostFromUrl(pageUrl) : ''

  if (!refHost || refHost === pageHost) return 'direct'

  if (/whatsapp\.com|wa\.me|api\.whatsapp/i.test(ref)) return 'whatsapp'

  if (/instagram\.com|cdninstagram/i.test(refHost)) return 'instagram'

  if (/facebook\.com|fb\.com|fbcdn\.net/i.test(refHost)) {
    if (/ads|ad_|fbclid|campaign/i.test(ref)) return 'facebook_ads'
    return 'social'
  }

  if (
    /twitter\.com|t\.co|linkedin\.com|tiktok\.com|pinterest\.com|reddit\.com|youtube\.com|youtu\.be/i.test(
      refHost,
    )
  ) {
    return 'social'
  }

  if (/google\./i.test(refHost)) {
    if (/\/url\?|aclk|adservice|doubleclick/i.test(ref)) return 'google_organic'
    return 'google_organic'
  }

  if (refHost && pageHost && refHost !== pageHost) return 'referral'

  return 'unknown'
}

export function trafficBucketLabel(bucket: TrafficBucket): string {
  const map: Record<TrafficBucket, string> = {
    google_organic: 'Google Organic',
    direct: 'Direct Traffic',
    social: 'Social Media',
    whatsapp: 'WhatsApp Link',
    facebook_ads: 'Facebook Ads',
    instagram: 'Instagram',
    referral: 'Referral Websites',
    unknown: 'Unknown',
  }
  return map[bucket]
}
