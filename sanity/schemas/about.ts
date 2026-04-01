import { defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About A.R. Rahman',
  type: 'document',
  fields: [
    defineField({
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'One-paragraph bio shown in the homepage About strip.',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'bio',
      title: 'Full Bio',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Extended bio (Portable Text) — used on any dedicated about page.',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Roles',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      initialValue: ['Composer', 'Singer', 'Producer', 'Pianist', 'Tamil', 'Hindi', 'World Music'],
    }),
    defineField({
      name: 'awards',
      title: 'Notable Awards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Award Name' }),
            defineField({ name: 'year', type: 'number', title: 'Year' }),
            defineField({ name: 'category', type: 'string', title: 'Category / Film' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'year' },
          },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              title: 'Platform',
              options: {
                list: ['Twitter / X', 'Instagram', 'Facebook', 'YouTube', 'Official Website'],
              },
            }),
            defineField({ name: 'url', type: 'url', title: 'URL' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'shortBio' },
    prepare({ title }) {
      return { title: 'About A.R. Rahman', subtitle: title }
    },
  },
})
