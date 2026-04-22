'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui/elements/Button'
import './index.scss'

const AdminHeader: React.FC = () => {
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Error signing out:', error)
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

