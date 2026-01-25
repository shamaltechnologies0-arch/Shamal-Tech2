'use client'

import React, { useState } from 'react'
import { useForm, useFormFields } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui/elements/Button'
import { Banner } from '@payloadcms/ui/elements/Banner'
import './index.scss'

const CustomPasswordField = (props: any) => {
  const { field, path } = props
  const { submit, setModified } = useForm()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<'success' | 'error' | null>(null)

  // Get password field values
  const password = useFormFields(([fields]) => fields.password?.value as string || '')
  const confirmPassword = useFormFields(([fields]) => fields.confirmPassword?.value as string || '')

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
      setTimeout(() => {
        setUpdateStatus(null)
        // Clear password fields
        if (field?.setValue) field.setValue('')
        // Reload to clear all password fields
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Error updating password:', error)
      setUpdateStatus('error')
    } finally {
      setIsUpdating(false)
    }
  }

  // Render default password field with custom buttons
  return (
    <div className="custom-password-field">
      {updateStatus === 'success' && (
        <Banner type="success" className="custom-password-field__banner">
          Password updated successfully!
        </Banner>
      )}
      {updateStatus === 'error' && (
        <Banner type="error" className="custom-password-field__banner">
          Failed to update password. Please check that passwords match and are at least 8 characters.
        </Banner>
      )}

      {/* Render the default password field */}
      <div className="custom-password-field__field">
        {/* The password field will be rendered by Payload's default component */}
        {/* We'll add buttons below it */}
      </div>

      {/* Add Update Password button beside Cancel */}
      <div className="custom-password-field__actions">
        <Button
          type="button"
          onClick={handleUpdatePassword}
          disabled={isUpdating || !password || password === ''}
        >
          {isUpdating ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </div>
  )
}

export default CustomPasswordField

