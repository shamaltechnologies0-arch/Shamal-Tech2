import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedField, authenticatedAdmin } from '../../access/authenticated'
import { adminOnly, adminOnlyField } from '../../access/adminOnly'
import { setInvitationToken, sendUserInvitation } from '../../hooks/sendUserInvitation'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticatedAdmin,
    create: adminOnly, // Only admins can create users
    delete: adminOnly,
    read: authenticated,
    update: ({ req: { user }, id }) => {
      // Users can update their own profile, admins can update anyone
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return user.id === id
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles', 'passwordSet'],
    useAsTitle: 'name',
    description: 'Users are created by admins. New users will receive an invitation email to set their password. When updating, leave password fields blank to keep current password.',
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
      access: {
        read: authenticatedField,
        update: ({ req: { user }, id }) => {
          // Users can update their own profile picture, admins can update anyone
          if (!user) return false
          if (user.roles?.includes('admin')) return true
          return user.id === id
        },
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Author',
          value: 'author',
        },
        {
          label: 'Sales',
          value: 'sales',
        },
        {
          label: 'Career',
          value: 'career',
        },
        {
          label: 'Designer',
          value: 'designer',
        },
        {
          label: 'Marketing',
          value: 'marketing',
        },
      ],
      defaultValue: [],
      required: false,
      saveToJWT: true,
      access: {
        read: authenticatedField,
        update: adminOnlyField,
      },
    },
    {
      name: 'roleDescription',
      type: 'textarea',
      label: 'Role Description',
      admin: {
        readOnly: true,
        description: 'Description of your assigned role(s)',
      },
      hooks: {
        afterRead: [
          ({ data, req }) => {
            if (!data?.roles || !Array.isArray(data.roles)) return ''
            
            const roleDescriptions: Record<string, string> = {
              admin: 'Full access to all features and settings. You can manage all collections, users, and system settings.',
              author: 'You can publish and manage blog posts. You have access to the Posts collection to create, edit, and publish blog content.',
              sales: 'You can add and manage products. You have access to the Products collection to create, edit, and manage product listings.',
              career: 'You can add and manage job postings. You have access to the Career collection to create, edit, and manage job listings.',
              designer: 'You can manage design-related content including media and visual assets.',
              marketing: 'You can manage SEO content for blogs and products. You have access to SEO fields in Posts and Products collections.',
            }
            
            const descriptions = data.roles
              .map((role: string) => roleDescriptions[role] || '')
              .filter(Boolean)
            
            return descriptions.join('\n\n')
          },
        ],
      },
    },
    {
      name: 'permissions',
      type: 'textarea',
      label: 'Your Permissions',
      admin: {
        readOnly: true,
        description: 'What you are allowed to do based on your role(s)',
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            if (!data?.roles || !Array.isArray(data.roles)) return 'No permissions assigned.'
            
            const permissions: Record<string, string[]> = {
              admin: [
                'Full access to all collections and settings',
                'Manage users and their roles',
                'Create, edit, and delete any content',
                'Access all system settings',
              ],
              author: [
                'Create, edit, and publish blog posts',
                'Manage blog categories and tags',
                'Upload media for blog posts',
                'View published and draft blog posts',
              ],
              sales: [
                'Create, edit, and manage products',
                'Upload product images',
                'Manage product categories',
                'View all products',
              ],
              career: [
                'Create, edit, and manage job postings',
                'Manage job categories and requirements',
                'View all job postings',
              ],
              designer: [
                'Manage media library',
                'Upload and organize images',
                'Access design-related content',
              ],
              marketing: [
                'Edit SEO fields in blog posts',
                'Edit SEO fields in products',
                'Manage meta titles, descriptions, and images',
                'View analytics and SEO settings',
              ],
            }
            
            const allPermissions = new Set<string>()
            data.roles.forEach((role: string) => {
              if (permissions[role]) {
                permissions[role].forEach(perm => allPermissions.add(perm))
              }
            })
            
            if (allPermissions.size === 0) return 'No permissions assigned.'
            
            return Array.from(allPermissions).map((perm, idx) => `${idx + 1}. ${perm}`).join('\n')
          },
        ],
      },
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
