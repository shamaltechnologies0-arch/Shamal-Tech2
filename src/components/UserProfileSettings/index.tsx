'use client'

import React, { useState } from 'react'
import { useAuth, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui/elements/Button'
import { Banner } from '@payloadcms/ui/elements/Banner'
import type { UIFieldClientComponent } from 'payload'
import './index.scss'

const UserProfileSettings: UIFieldClientComponent = () => {
  const { user } = useAuth()
  const { id } = useDocumentInfo()
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportDescription, setReportDescription] = useState('')
  const [reportScreenshot, setReportScreenshot] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  // Get role description and permissions from form fields
  const roleDescription = useFormFields(([fields]) => fields.roleDescription?.value as string || '')
  const permissions = useFormFields(([fields]) => fields.permissions?.value as string || '')
  const roles = useFormFields(([fields]) => (fields.roles?.value as string[]) || [])

  // Check if this is the current user's own profile
  const isOwnProfile = user?.id === id

  if (!isOwnProfile) {
    return null // Only show on own profile
  }

  const handleReportIssue = async () => {
    if (!reportDescription.trim()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const formData = new FormData()
      formData.append('description', reportDescription)
      formData.append('userId', String(user?.id || ''))
      formData.append('userEmail', String(user?.email || ''))
      formData.append('userName', String(user?.name || ''))
      
      if (reportScreenshot) {
        formData.append('screenshot', reportScreenshot)
      }

      // Use the Payload API endpoint which is accessible from admin panel
      const response = await fetch('/api/issue-reports', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
      })

      const data = await response.json().catch(() => ({
        error: 'Failed to parse response',
      }))

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setReportDescription('')
        setReportScreenshot(null)
        setShowReportModal(false)
        setTimeout(() => setSubmitStatus(null), 5000)
      } else {
        console.error('Error response:', data)
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReportScreenshot(e.target.files[0])
    }
  }

  return (
    <div className="user-profile-settings">
      <Banner type="info" className="user-profile-settings__banner">
        <h4>Profile Settings</h4>
        <p>Manage your profile picture and view your role information here.</p>
      </Banner>

      <div className="user-profile-settings__content">
        <div className="user-profile-settings__section">
          <h5>Your Role(s)</h5>
          <div className="user-profile-settings__roles">
            {roles.length > 0 ? (
              roles.map((role) => (
                <span key={role} className="user-profile-settings__role-badge">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              ))
            ) : (
              <p className="user-profile-settings__no-role">No role assigned</p>
            )}
          </div>
        </div>

        {roleDescription && (
          <div className="user-profile-settings__section">
            <h5>Role Description</h5>
            <div className="user-profile-settings__description">
              {roleDescription.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {permissions && (
          <div className="user-profile-settings__section">
            <h5>Your Permissions</h5>
            <div className="user-profile-settings__permissions">
              {permissions.split('\n').map((perm, idx) => (
                <div key={idx} className="user-profile-settings__permission-item">
                  {perm}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="user-profile-settings__section">
          <h5>Need Help?</h5>
          <p>If something is not working or you need assistance, please report it to the admin.</p>
          <Button
            onClick={() => setShowReportModal(true)}
            buttonStyle="secondary"
            className="user-profile-settings__report-button"
          >
            Report an Issue
          </Button>
        </div>

        <div className="user-profile-settings__section">
          <h5>Account Actions</h5>
          <Button
            onClick={async () => {
              try {
                const response = await fetch('/api/users/logout', {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })

                if (response.ok || response.status === 401) {
                  localStorage.clear()
                  sessionStorage.clear()
                  window.location.href = '/admin/login'
                } else {
                  localStorage.clear()
                  sessionStorage.clear()
                  window.location.href = '/admin/login'
                }
              } catch (error) {
                console.error('Error signing out:', error)
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = '/admin/login'
              }
            }}
            buttonStyle="secondary"
            className="user-profile-settings__signout-button"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {showReportModal && (
        <div className="user-profile-settings__modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="user-profile-settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-profile-settings__modal-header">
              <h4>Report an Issue</h4>
              <button
                className="user-profile-settings__modal-close"
                onClick={() => setShowReportModal(false)}
              >
                ×
              </button>
            </div>
            <div className="user-profile-settings__modal-body">
              {submitStatus === 'success' && (
                <Banner type="success">
                  Issue reported successfully! The admin will review it shortly.
                </Banner>
              )}
              {submitStatus === 'error' && (
                <Banner type="error">
                  Failed to submit report. Please check your connection and try again. If the problem persists, contact admin directly.
                </Banner>
              )}
              <div className="user-profile-settings__form-group">
                <label htmlFor="report-description">Description *</label>
                <textarea
                  id="report-description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe the issue you're experiencing..."
                  rows={5}
                  required
                />
              </div>
              <div className="user-profile-settings__form-group">
                <label htmlFor="report-screenshot">Screenshot (Optional)</label>
                <input
                  id="report-screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                />
                {reportScreenshot && (
                  <p className="user-profile-settings__file-name">
                    Selected: {reportScreenshot.name}
                  </p>
                )}
              </div>
            </div>
            <div className="user-profile-settings__modal-footer">
              <Button
                onClick={() => setShowReportModal(false)}
                buttonStyle="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReportIssue}
                disabled={isSubmitting || !reportDescription.trim()}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileSettings

