import canUseDOM from './canUseDOM'

export const getServerSideURL = () => {
  // Priority: NEXT_PUBLIC_SERVER_URL > AWS Amplify > Vercel > localhost
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }

  // AWS Amplify support
  if (process.env.AWS_APP_ID && process.env.AWS_BRANCH) {
    // AWS Amplify provides these environment variables
    // Format: https://{branch}.{appId}.amplifyapp.com
    const branch = process.env.AWS_BRANCH === 'main' ? 'main' : process.env.AWS_BRANCH
    return `https://${branch}.${process.env.AWS_APP_ID}.amplifyapp.com`
  }

  // Vercel support - check both VERCEL_URL (runtime) and VERCEL_PROJECT_PRODUCTION_URL (production)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // Fallback to localhost for development
  return 'http://localhost:3000'
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
