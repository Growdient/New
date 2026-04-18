import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      description: 'Default: Growdient Studio — Brand Identity, UI/UX, Web Development',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      type: 'text',
      rows: 3,
      description: 'Default meta description for pages without their own',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG image',
      type: 'image',
      description: 'Used when sharing links on social media (1200×630px recommended)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter / X handle',
      type: 'string',
      description: 'e.g. @growdient',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone number',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
