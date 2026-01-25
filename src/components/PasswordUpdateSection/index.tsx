'use client'

import React, { useState } from 'react'
import { useForm, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui/elements/Button'
import { Banner } from '@payloadcms/ui/elements/Banner'
import './index.scss'

const PasswordUpdateSection: React.FC = () => {
  const { id } = useDocumentInfo()
  const { submit, setModified } = useForm()
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<'success' | 'error' | null>(null)

  // Get password field values
  const password = useFormFields(([fields]) => fields.password?.value as string || '')
  const confirmPassword = useFormFields(([fields]) => fields.confirmPassword?.value as string || '')

  const isUpdate = Boolean(id)

  if (!isUpdate) {
    return null // Don't show on create
  }

  const handleUpdatePassword = async () => {
    // Validate passwords
    if (!password || password === '') {
      setUpdateStatus('error')
      return
    }

    if (password !== confirmPassword) {
      setUpdateStatus('error')
      return
    }

    if (password.length < 8) {
      setUpdateStatus('error')
      return
    }

    setIsUpdating(true)
    setUpdateStatus(null)
    setModified(true)

    try {
      await submit()
      setUpdateStatus('success')
      setShowPasswordFields(false)
      setTimeout(() => {
        setUpdateStatus(null)
        // Reload to clear password fields
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Error updating password:', error)
      setUpdateStatus('error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setShowPasswordFields(false)
    setUpdateStatus(null)
    // Reload to clear password fields
    window.location.reload()
  }

  return (
    <div className="password-update-section">
      {updateStatus === 'success' && (
        <Banner type="success" className="password-update-section__banner">
          Password updated successfully!
        </Banner>
      )}
      {updateStatus === 'error' && (
        <Banner type="error" className="password-update-section__banner">
          Failed to update password. Please check that passwords match and are at least 8 characters.
        </Banner>
      )}

      {!showPasswordFields ? (
        <div className="password-update-section__trigger">
          <Button
            type="button"
            onClick={() => setShowPasswordFields(true)}
            buttonStyle="secondary"
          >
            Change Password
          </Button>
        </div>
      ) : (
        <div className="password-update-section__update">
          <div className="password-update-section__note">
            <p>Enter your new password. Leave blank in the form fields above to keep current password.</p>
          </div>
          <div className="password-update-section__actions">
            <Button
              type="button"
              onClick={handleCancel}
              buttonStyle="secondary"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdatePassword}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PasswordUpdateSection

