import { defineArrayMember, defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Project name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services (main label)',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail image',
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
    defineField({
      name: 'images',
      title: 'Gallery images',
      type: 'array',
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
          ],
        }),
      ],
    }),
    defineField({
      name: 'texts',
      title: 'Body paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
      description: 'Add 3 paragraphs of project description',
    }),
    defineField({
      name: 'quoteText',
      title: 'Quote text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'quoteAuthor',
      title: 'Quote author',
      type: 'string',
    }),
    defineField({
      name: 'quoteRole',
      title: 'Quote author role',
      type: 'string',
    }),
    defineField({
      name: 'liveWebsite',
      title: 'Live website URL',
      type: 'url',
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Order (lower = first)',
      type: 'number',
      initialValue: 99,
    }),
    defineField({
      name: 'isDraft',
      title: 'Draft (hide from site)',
      type: 'boolean',
      initialValue: false,
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
