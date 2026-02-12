import React from 'react'

/**
 * Custom logo for the Payload Admin Panel login page and other admin contexts.
 * Replaces the default Payload logo with the Shamal Technologies logo.
 */
export default function AdminLogo() {
  return (
    <img
      src="/logo-white.svg"
      alt="Shamal Technologies"
      width={220}
      height={44}
      style={{ height: 'auto', maxWidth: '220px', width: '100%', display: 'block' }}
    />
  )
}
