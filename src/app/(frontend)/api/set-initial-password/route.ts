import { NextResponse } from 'next/server'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, email, password } = body

    // Validate required fields
    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Token, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Find user by email
    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase().trim(),
        },
      },
      limit: 1,
    })

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = users[0]

    // Validate token matches
    if (user.resetPasswordToken !== token) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // Validate token hasn't expired
    if (user.resetPasswordExpiration && new Date(user.resetPasswordExpiration) < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired. Please contact admin for a new invitation.' },
        { status: 400 }
      )
    }

    // Validate email matches (case-insensitive)
    if (user.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return NextResponse.json(
        { error: 'Email does not match the invitation' },
        { status: 400 }
      )
    }

    // Update user password and clear reset token
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password,
        resetPasswordToken: null,
        resetPasswordExpiration: null,
      },
      overrideAccess: true, // Required for API routes
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Password set successfully. You can now log in.',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Set initial password error:', error)
    return NextResponse.json(
      {
        error: 'Failed to set password',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}

