import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Employees: CollectionConfig = {
  slug: 'employees',
  access: {
    create: authenticated,
    read: ({ req }) => {
      if (req?.user) return true
      return { status: { equals: 'published' } }
    },
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['fullName', 'businessEmail', 'slug', 'status', 'updatedAt'],
    useAsTitle: 'fullName',
    description:
      'Employee digital profiles for QR code business cards. Each employee gets a unique public URL for their profile. Export to Excel: /api/employees/export (must be logged in).',
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return data?.slug ? `${baseURL}/profile/${data.slug}` : baseURL
      },
    },
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
      required: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'businessEmail',
      type: 'email',
      required: true,
      label: 'Business Email',
    },
    {
      name: 'linkedInUrl',
      type: 'text',
      label: 'LinkedIn Profile URL',
      admin: {
        description: 'Full LinkedIn profile URL (e.g. https://linkedin.com/in/username)',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      label: 'Personal/Portfolio Website URL',
    },
    {
      name: 'companyProfileArabic',
      type: 'upload',
      relationTo: 'media',
      label: 'Company Profile (Arabic)',
      admin: {
        description: 'PDF file - Company profile in Arabic',
      },
      filterOptions: {
        mimeType: { equals: 'application/pdf' },
      },
    },
    {
      name: 'companyProfileEnglish',
      type: 'upload',
      relationTo: 'media',
      label: 'Company Profile (English)',
      admin: {
        description: 'PDF file - Company profile in English',
      },
      filterOptions: {
        mimeType: { equals: 'application/pdf' },
      },
    },
    {
      name: 'companyProfileFolderUrl',
      type: 'text',
      label: 'OneDrive/Cloud Folder URL (Alternative)',
      admin: {
        description:
          'Optional: Public folder link containing both Arabic & English PDFs. If set, this will be shown instead of individual PDF buttons.',
      },
    },
    {
      name: 'companyWebsiteUrl',
      type: 'text',
      label: 'Company Website',
      admin: {
        description: 'Main company website URL (displayed at bottom of profile)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Published profiles are visible on the public QR page',
      },
    },
    {
      name: 'qrCode',
      type: 'ui',
      admin: {
        position: 'sidebar',
        description: 'QR code for business cards. Use this URL when generating QR codes.',
        components: {
          Field: '/collections/Employees/QRCodeField#default',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique URL for profile (used in QR code). Auto-generated on save.',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (data && operation === 'create' && !data.slug) {
          const baseSlug = (data.fullName || 'employee')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
          const uniqueId = crypto.randomUUID().slice(0, 8)
          const candidateSlug = `${baseSlug || 'profile'}-${uniqueId}`

          const payload = req.payload
          const existing = await payload.find({
            collection: 'employees',
            where: { slug: { equals: candidateSlug } },
            limit: 1,
          })
          data.slug = existing.docs.length > 0 ? `${candidateSlug}-${Date.now().toString(36)}` : candidateSlug
        }
        return data
      },
    ],
  },
  timestamps: true,
}
