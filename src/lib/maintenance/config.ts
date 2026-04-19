/**
 * Site-wide maintenance mode (Edge-safe). Enable with MAINTENANCE_MODE=true
 */

export function isMaintenanceMode(): boolean {
  // Edge middleware often does not see arbitrary process.env keys unless they are
  // passed through next.config.js `env` or prefixed with NEXT_PUBLIC_ — check both.
  const v = (
    process.env.MAINTENANCE_MODE ||
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE ||
    ''
  )
    .trim()
    .toLowerCase()
  return v === 'true' || v === '1' || v === 'yes'
}

/** Retry-After value in seconds (RFC 7231). Default 1 hour. */
export function getMaintenanceRetryAfterSeconds(): number {
  const raw = process.env.MAINTENANCE_RETRY_AFTER
  if (!raw) return 3600
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 ? n : 3600
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

export type MaintenanceContact = {
  whatsappHref: string | null
  mailtoHref: string | null
  telHref: string | null
}

/**
 * WhatsApp: MAINTENANCE_WHATSAPP_NUMBER (digits, country code) or digits from CONTACT_PHONE.
 * Email: CONTACT_EMAIL. Call uses the same E.164 digits as WhatsApp (tel:+{digits}).
 */
export function getMaintenanceContact(): MaintenanceContact {
  const waExplicit = process.env.MAINTENANCE_WHATSAPP_NUMBER?.trim() || ''
  const phone = process.env.CONTACT_PHONE?.trim() || ''
  const waDigits = waExplicit ? digitsOnly(waExplicit) : digitsOnly(phone)

  const whatsappHref =
    waDigits.length > 0 ? `https://wa.me/${waDigits}` : null

  const email = process.env.CONTACT_EMAIL?.trim()
  const mailtoHref =
    email && !/[<>"']/.test(email) ? `mailto:${email}` : null

  const telHref =
    waDigits.length > 0 ? `tel:+${waDigits}` : null

  return { whatsappHref, mailtoHref, telHref }
}
