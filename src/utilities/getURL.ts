import canUseDOM from './canUseDOM'

/** Bare hostnames (e.g. shamal.sa) are invalid for `new URL()`; assume https. */
function normalizePublicServerUrl(url: string): string {
  const t = url.trim()
  if (!t) return ''
  return /^https?:\/\//i.test(t) ? t : `https://${t}`
}

function isLocalhostLikeHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0'
}

function shouldIgnoreConfiguredPublicURL(normalizedUrl: string): boolean {
  // In deployed runtimes (Vercel/AWS), localhost URLs break admin/API host resolution.
  const isDeployed = !!(process.env.VERCEL || process.env.VERCEL_URL || process.env.AWS_APP_ID)
  if (!isDeployed) return false

  try {
    const { hostname } = new URL(normalizedUrl)
    return isLocalhostLikeHost(hostname)
  } catch {
    return false
  }
}

export const getServerSideURL = () => {
  // Priority: NEXT_PUBLIC_SERVER_URL > AWS Amplify > Vercel > localhost
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    const normalized = normalizePublicServerUrl(process.env.NEXT_PUBLIC_SERVER_URL)
    if (normalized && !shouldIgnoreConfiguredPublicURL(normalized)) return normalized
  }

  // AWS Amplify support
  if (process.env.AWS_APP_ID && process.env.AWS_BRANCH) {
    // AWS Amplify provides these environment variables
    // Format: https://{branch}.{appId}.amplifyapp.com
    const branch = process.env.AWS_BRANCH === 'main' ? 'main' : process.env.AWS_BRANCH
    return `https://${branch}.${process.env.AWS_APP_ID}.amplifyapp.com`
  }

  // Vercel support - check both VERCEL_URL (runtime) and VERCEL_PROJECT_PRODUCTION_URL (production)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Fallback to localhost for development
  return 'https://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  // Server-side: use same logic as getServerSideURL
  return getServerSideURL()
}
