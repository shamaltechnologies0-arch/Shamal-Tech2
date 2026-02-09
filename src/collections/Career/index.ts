import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import { anyone } from '../../access/anyone'

export const Career: CollectionConfig = {
  slug: 'career',
  access: {
    read: anyone,
    create: anyone,
    update: anyone,
    delete: anyone,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'department', 'location', 'status', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title',
    },
    {
      name: 'titleAr',
      type: 'text',
      label: 'Job Title (Arabic)',
      admin: {
        description: 'Arabic job title displayed when Arabic language is selected',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Job Details',
          fields: [
            {
              name: 'department',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Engineering',
                  value: 'engineering',
                },
                {
                  label: 'Sales',
                  value: 'sales',
                },
                {
                  label: 'Marketing',
                  value: 'marketing',
                },
                {
                  label: 'Operations',
                  value: 'operations',
                },
                {
                  label: 'HR',
                  value: 'hr',
                },
                {
                  label: 'Finance',
                  value: 'finance',
                },
                {
                  label: 'Other',
                  value: 'other',
                },
              ],
            },
            {
              name: 'location',
              type: 'text',
              required: true,
              label: 'Job Location',
              defaultValue: 'Saudi Arabia',
            },
            {
              name: 'locationAr',
              type: 'text',
              label: 'Job Location (Arabic)',
            },
            {
              name: 'employmentType',
              type: 'select',
              required: true,
              label: 'Employment Type',
              options: [
                {
                  label: 'Full-time',
                  value: 'full-time',
                },
                {
                  label: 'Part-time',
                  value: 'part-time',
                },
                {
                  label: 'Contract',
                  value: 'contract',
                },
                {
                  label: 'Internship',
                  value: 'internship',
                },
              ],
            },
            {
              name: 'gender',
              type: 'select',
              label: 'Gender Preference',
              options: [
                {
                  label: 'Male',
                  value: 'male',
                },
                {
                  label: 'Female',
                  value: 'female',
                },
                {
                  label: 'No Preference',
                  value: 'no-preference',
                },
              ],
              admin: {
                description: 'Select the preferred gender for this position (optional)',
              },
            },
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              options: [
                {
                  label: 'Draft',
                  value: 'draft',
                },
                {
                  label: 'Published',
                  value: 'published',
                },
                {
                  label: 'Closed',
                  value: 'closed',
                },
              ],
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured Image',
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              label: 'Job Description',
            },
            {
              name: 'descriptionAr',
              type: 'richText',
              label: 'Job Description (Arabic)',
            },
            {
              name: 'requirements',
              type: 'array',
              label: 'Job Requirements',
              fields: [
                {
                  name: 'requirement',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'requirementAr',
                  type: 'text',
                  label: 'Requirement (Arabic)',
                },
              ],
            },
            {
              name: 'responsibilities',
              type: 'array',
              label: 'Key Responsibilities',
              fields: [
                {
                  name: 'responsibility',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'responsibilityAr',
                  type: 'text',
                  label: 'Responsibility (Arabic)',
                },
              ],
            },
            {
              name: 'qualifications',
              type: 'array',
              label: 'Required Qualifications',
              fields: [
                {
                  name: 'qualification',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'qualificationAr',
                  type: 'text',
                  label: 'Qualification (Arabic)',
                },
              ],
            },
            {
              name: 'salaryRange',
              type: 'text',
              label: 'Salary Range (Optional)',
            },
            {
              name: 'applicationDeadline',
              type: 'date',
              label: 'Application Deadline',
            },
            {
              name: 'applicationEmail',
              type: 'email',
              label: 'Application Email',
            },
            {
              name: 'applicationUrl',
              type: 'text',
              label: 'Application URL (Optional)',
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'seo.metaTitle',
              descriptionPath: 'seo.metaDescription',
              imagePath: 'seo.ogImage',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            {
              name: 'keywords',
              type: 'text',
              label: 'Keywords',
            },
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'seo.metaTitle',
              descriptionPath: 'seo.metaDescription',
            }),
          ],
        },
      ],
    },
    slugField({ fieldToUse: 'title' }),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}

