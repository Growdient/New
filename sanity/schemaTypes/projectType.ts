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
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
            defineField({
              name: 'mobileImage',
              title: 'Mobile version (vertical)',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt text',
                  type: 'string',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content blocks (flexible order)',
      type: 'array',
      group: 'content',
      description: 'Add text and images in any order. Use "half" layout to place two images side by side.',
      of: [
        defineArrayMember({
          name: 'textBlock',
          type: 'object',
          title: 'Text',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'text',
              rows: 4,
            }),
          ],
          preview: {
            select: { title: 'text' },
            prepare({ title }) {
              return { title: title?.slice(0, 60) ?? 'Text block', subtitle: 'Text' }
            },
          },
        }),
        defineArrayMember({
          name: 'imageBlock',
          type: 'object',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
              ],
            }),
            defineField({
              name: 'mobileImage',
              title: 'Mobile version (vertical)',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
              ],
            }),
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              initialValue: 'full',
              options: {
                list: [
                  { title: 'Full width', value: 'full' },
                  { title: 'Half (2 columns)', value: 'half' },
                ],
                layout: 'radio',
              },
            }),
          ],
          preview: {
            select: { media: 'image', layout: 'layout' },
            prepare({ media, layout }) {
              return { title: layout === 'half' ? 'Image — half' : 'Image — full', media }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'texts',
      title: 'Body paragraphs (legacy)',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'text' })],
      description: 'Legacy field — use Content blocks above for new projects',
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
