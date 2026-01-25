'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@payloadcms/ui/elements/Button'
import { Banner } from '@payloadcms/ui/elements/Banner'
import './index.scss'

const ResetPassword: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const token = searchParams.get('token')
  const emailParam = searchParams.get('email')

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [emailParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!email || !email.trim()) {
      setError('Email is required')
      return
    }

    if (!token) {
      setError('Invalid reset link. Please contact admin for a new invitation.')
      return
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/set-initial-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } else {
        setError(data.error || 'Failed to set password. Please try again.')
      }
    } catch (err) {
      console.error('Error setting password:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="reset-password">
        <Banner type="success">
          <h3>Password Set Successfully!</h3>
          <p>Redirecting to login page...</p>
        </Banner>
      </div>
    )
  }

  return (
    <div className="reset-password">
      <div className="reset-password__container">
        <h2>Set Your Password</h2>
        <p className="reset-password__description">
          Please enter your email address and set a new password to complete your account setup.
        </p>

        {error && (
          <Banner type="error" className="reset-password__banner">
            {error}
          </Banner>
        )}

        <form onSubmit={handleSubmit} className="reset-password__form">
          <div className="reset-password__field">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={!!emailParam} // Disable if email is in URL
            />
            {emailParam && (
              <p className="reset-password__hint">
                Email must match the invitation: {emailParam}
              </p>
            )}
          </div>

          <div className="reset-password__field">
            <label htmlFor="password">New Password *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password (min. 8 characters)"
              required
              minLength={8}
            />
          </div>

          <div className="reset-password__field">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="reset-password__submit"
          >
            {isSubmitting ? 'Setting Password...' : 'Set Password'}
          </Button>
        </form>

        <p className="reset-password__help">
          If you&apos;re having trouble, please contact your administrator.
        </p>
      </div>
    </div>
  )
}

export default ResetPassword

