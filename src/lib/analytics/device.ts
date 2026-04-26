export type DeviceKind = 'mobile' | 'tablet' | 'desktop' | 'unknown'

export function detectDeviceType(
  userAgent: string | null | undefined,
  secChUaMobile: string | null | undefined,
): DeviceKind {
  const ua = (userAgent || '').toLowerCase()
  if (secChUaMobile === '?1' || /mobile|iphone|ipod|android.*mobile|webos|blackberry|opera mini|iemobile/i.test(ua)) {
    if (/ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(ua)) return 'tablet'
    return 'mobile'
  }
  if (/ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(ua)) return 'tablet'
  if (ua.length > 0) return 'desktop'
  return 'unknown'
}

export function detectBrowserName(userAgent: string | null | undefined): string {
  const ua = userAgent || ''
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome'
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari'
  if (/Firefox\//i.test(ua)) return 'Firefox'
  if (/Opera|OPR\//i.test(ua)) return 'Opera'
  return 'Other'
}
