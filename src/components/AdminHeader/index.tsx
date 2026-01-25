'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui/elements/Button'
import './index.scss'

const AdminHeader: React.FC = () => {
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      // Use Payload's logout endpoint
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok || response.status === 401) {
        // Clear any local storage
        localStorage.clear()
        sessionStorage.clear()
        // Redirect to login page
        window.location.href = '/admin/login'
      } else {
        // Fallback: clear local storage and redirect
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback: clear local storage and redirect
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/admin/login'
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="admin-header-signout">
      <Button
        type="button"
        onClick={handleSignOut}
        buttonStyle="secondary"
        className="admin-header-signout__button"
      >
        Sign Out
      </Button>
    </div>
  )
}

export default AdminHeader

