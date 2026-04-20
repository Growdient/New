import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Short description shown in cards and meta tags',
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover image',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Branding Strategy', value: 'Branding Strategy' },
          { title: 'AI in Design', value: 'AI in Design' },
          { title: 'Design Services', value: 'Design Services' },
          { title: 'Web Development', value: 'Web Development' },
          { title: 'Web & UI/UX', value: 'Web & UI/UX' },
          { title: 'Naming & Positioning', value: 'Naming & Positioning' },
          { title: 'Logo Design', value: 'Logo Design' },
          { title: 'Brand Identity', value: 'Brand Identity' },
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: { type: 'author' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
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
      description: 'Title for social sharing (Facebook, LinkedIn, Telegram). Falls back to Page title.',
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
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
