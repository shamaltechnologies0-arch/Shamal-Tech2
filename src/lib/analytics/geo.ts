/** Prefer edge headers (no third-party geo API). */
export function countryFromRequestHeaders(headers: Headers): { country: string; city: string } {
  const cf = headers.get('cf-ipcountry') || headers.get('x-vercel-ip-country')
  const city = headers.get('x-vercel-ip-city') || ''
  if (cf && cf !== 'XX') return { country: cf, city: decodeURIComponent(city || '') }
  return { country: '', city: '' }
}
