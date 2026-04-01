import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'ar-rahman-fansite',
  title: 'A.R. Rahman Fan Site — CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton documents
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage-singleton')
              ),
            S.listItem()
              .title('About A.R. Rahman')
              .id('about')
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about-singleton')
              ),
            S.divider(),
            // Collection
            S.documentTypeListItem('performance').title('Performances & Concerts'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
