import { defineArrayMember, defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Project name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services (main label)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Gallery images',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'galleryImage',
          type: 'object',
          title: 'Image',
          fields: [
            defineField({
              name: 'desktop',
              title: 'Desktop (horizontal)',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
              ],
            }),
            defineField({
              name: 'mobile',
              title: 'Mobile (vertical)',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
              ],
            }),
          ],
          preview: {
            select: { media: 'desktop' },
            prepare({ media }) {
              return { title: 'Image', media }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'texts',
      title: 'Body paragraphs',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'text' })],
      description: 'Add 3 paragraphs of project description',
    }),
    defineField({
      name: 'quoteText',
      title: 'Quote text',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
    defineField({
      name: 'quoteAuthor',
      title: 'Quote author',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'quoteRole',
      title: 'Quote author role',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'liveWebsite',
      title: 'Live website URL',
      type: 'url',
      group: 'content',
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'order',
      title: 'Order (lower = first)',
      type: 'number',
      group: 'content',
      initialValue: 99,
    }),
    defineField({
      name: 'isDraft',
      title: 'Draft (hide from site)',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    // SEO tab
    defineField({
      name: 'metaTitle',
      title: 'Page title',
      type: 'string',
      group: 'seo',
      description: 'Shown in browser tab and Google results. 50–60 characters.',
      validation: (Rule) => Rule.max(60).warning('Keep under 60 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Shown in Google search results. 120–160 characters.',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters'),
    }),
    defineField({
      name: 'ogTitle',
      title: 'OG title',
      type: 'string',
      group: 'seo',
      description: 'Title for social sharing. Falls back to Page title.',
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Description for social sharing. Falls back to Meta description.',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG image',
      type: 'image',
      group: 'seo',
      description: '1200×630px. Shown when sharing link in social media.',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'client',
      media: 'thumbnail',
    },
  },
})
