import React from 'react'

import BusinessProgressMonitoring from '../BusinessProgressMonitoring'
import BackupRecoveryCenter from '../BackupRecoveryCenter'

/**
 * Payload `beforeDashboard` slot: analytics first, then backup tools.
 */
export default function AdminDashboardBefore() {
  return (
    <>
      <BusinessProgressMonitoring />
      <BackupRecoveryCenter />
    </>
  )
}
