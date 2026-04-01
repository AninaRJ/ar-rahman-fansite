import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  // Singleton — only one document of this type
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'welcomeHeading',
      title: 'Welcome Heading',
      type: 'string',
      description: 'Main hero heading. Use | to insert a line break.',
      initialValue: 'The Sound of A.R. Rahman',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'welcomeSubheading',
      title: 'Welcome Subheading',
      type: 'string',
      description: 'Eyebrow text above the heading (e.g. "A Tribute to the Maestro")',
      initialValue: 'A Tribute to the Maestro',
    }),
    defineField({
      name: 'welcomeBody',
      title: 'Welcome Body Text',
      type: 'text',
      rows: 3,
      description: 'Short paragraph below the hero heading.',
      initialValue:
        'Celebrating six decades of musical genius — from Chennai\'s studios to the world\'s grandest stages.',
      validation: (Rule) => Rule.max(300),
    }),
  ],
  preview: {
    select: { title: 'welcomeHeading' },
  },
})
