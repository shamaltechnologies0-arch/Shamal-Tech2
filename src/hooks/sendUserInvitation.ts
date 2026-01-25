import type { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload'
import crypto from 'crypto'

import { sendUserInvitationEmail } from '../lib/email/userInvitation'
import { getServerSideURL } from '../utilities/getURL'

// Set reset token before creation
export const setInvitationToken: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  // Only set token when admin creates a new user without a password
  if (operation !== 'create') {
    return data
  }

  // Skip if no email provided
  if (!data.email) {
    return data
  }

  // Check if user is being created with a password
  // If password exists and is not empty, skip token generation
  const hasPassword = data.password && 
                      data.password !== '' && 
                      data.password !== null && 
                      data.password !== undefined

  if (hasPassword) {
    // User is being created with a password, no invitation needed
    return data
  }

  // Generate password reset token for first-time password setup
  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  return {
    ...data,
    resetPasswordToken: resetToken,
    resetPasswordExpiration: resetTokenExpiry,
  }
}

// Send invitation email after creation
export const sendUserInvitation: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // Only send invitation when admin creates a new user
  if (operation !== 'create') {
    return doc
  }

  // Skip if user already has a password (not a new invitation)
  if (doc.password) {
    return doc
  }

  // Skip if no email or reset token
  if (!doc.email || !doc.resetPasswordToken) {
    return doc
  }

  // Send invitation email
  const baseURL = getServerSideURL()
  const resetURL = `${baseURL}/admin/reset-password?token=${doc.resetPasswordToken}&email=${encodeURIComponent(doc.email)}`

  try {
    await sendUserInvitationEmail({
      to: doc.email,
      name: doc.name || 'User',
      resetURL,
      roles: doc.roles || [],
    })
  } catch (error) {
    console.error('Failed to send user invitation email:', error)
    // Don't throw - allow user creation even if email fails
  }

  return doc
}

