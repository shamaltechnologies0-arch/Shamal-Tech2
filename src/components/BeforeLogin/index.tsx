import React from 'react'

import AdminLogo from '../AdminLogo'

const BeforeLogin: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <AdminLogo />
      </div>
      <p>
        <b>Welcome to your dashboard!</b>
        {' This is where site admins will log in to manage your website.'}
      </p>
    </div>
  )
}

export default BeforeLogin
