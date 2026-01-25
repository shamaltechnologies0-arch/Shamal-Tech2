import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { setInvitationToken, sendUserInvitation } from '../../hooks/sendUserInvitation'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: anyone,
    create: anyone,
    delete: anyone,
    read: anyone,
    update: anyone,
  },
  admin: {
    defaultColumns: ['name', 'email', 'passwordSet'],
    useAsTitle: 'name',
    description: 'Admin users. New users will receive an invitation email to set their password. When updating, leave password fields blank to keep current password.',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Picture',
    },
    {
      name: 'passwordSet',
      type: 'checkbox',
      label: 'Password Set',
      admin: {
        readOnly: true,
        description: 'Indicates if the user has set their password',
        position: 'sidebar',
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            // Password is set if user has a password hash
            return Boolean(data?.password)
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      setInvitationToken,
      // PayloadCMS auth collections make password optional on updates automatically
      // Only remove password fields if they're explicitly empty to prevent issues when updating other fields
      async ({ data, operation }) => {
        if (operation === 'update') {
          // Check if password fields are present and empty
          const passwordValue = data?.password
          const confirmPasswordValue = data?.confirmPassword
          
          // If password is empty/null/undefined, remove it so it doesn't interfere with other field updates
          if (!passwordValue || (typeof passwordValue === 'string' && passwordValue.trim() === '')) {
            delete data.password
          }
          if (!confirmPasswordValue || (typeof confirmPasswordValue === 'string' && confirmPasswordValue.trim() === '')) {
            delete data.confirmPassword
          }
        }
        return data
      },
    ],
    afterChange: [sendUserInvitation],
  },
  timestamps: true,
}
