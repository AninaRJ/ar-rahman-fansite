import { defineField, defineType } from 'sanity'

export const performance = defineType({
  name: 'performance',
  title: 'Performance / Concert',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      description: 'e.g. "Jai Ho World Tour — Mumbai" or "Oscars 2024 Tribute Performance"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Concert', value: 'Concert' },
          { title: 'Award Show', value: 'Award Show' },
          { title: 'TV Performance', value: 'TV Performance' },
          { title: 'Film Event', value: 'Film Event' },
          { title: 'Festival', value: 'Festival' },
          { title: 'Special', value: 'Special' },
        ],
        layout: 'radio',
      },
      initialValue: 'Concert',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Video URL',
      type: 'url',
      description: 'Full YouTube watch URL — e.g. https://www.youtube.com/watch?v=XXXXXXXXXXX',
      validation: (Rule) =>
        Rule.uri({ allowRelative: false, scheme: ['https', 'http'] }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional short description of the event.',
    }),
    defineField({
      name: 'setlist',
      title: 'Setlist',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional list of songs performed (in order).',
    }),
  ],
  orderings: [
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'type',
    },
    prepare({ title, subtitle }) {
      return { title, subtitle }
    },
  },
})
