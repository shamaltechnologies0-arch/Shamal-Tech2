import { NextRequest } from 'next/server'
import QRCode from 'qrcode'

import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

/**
 * GET /api/qr?slug=employee-slug
 * Returns a QR code PNG image for the employee profile URL.
 * Used in admin panel and for printing business cards.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug || typeof slug !== 'string') {
    return new Response('Missing slug parameter', { status: 400 })
  }

  const baseUrl = getServerSideURL()
  const profileUrl = `${baseUrl}/profile/${slug}`

  try {
    const qrBuffer = await QRCode.toBuffer(profileUrl, {
      type: 'png',
      width: 256,
      margin: 2,
      errorCorrectionLevel: 'M',
    })

    return new Response(qrBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('QR generation failed:', error)
    return new Response('QR generation failed', { status: 500 })
  }
}
