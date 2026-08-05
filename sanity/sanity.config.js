import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {CogIcon} from '@sanity/icons/Cog'
import {schemaTypes} from './schemaTypes'

const LAYOUT_TYPES = ['siteLayout', 'footer']

export default defineConfig({
  name: 'default',
  title: 'Rizz Lending',

  projectId: 'gx0bybp7',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...S.documentTypeListItems().filter(
              (listItem) => !LAYOUT_TYPES.includes(listItem.getId()),
            ),
            S.divider(),
            S.listItem()
              .title('Layout')
              .icon(CogIcon)
              .child(
                S.list()
                  .title('Layout')
                  .items([
                    S.listItem()
                      .title('Site layout')
                      .icon(CogIcon)
                      .child(S.document().schemaType('siteLayout').documentId('siteLayout')),
                    S.divider(),
                    S.documentTypeListItem('footer'),
                  ]),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((template) => template.templateId !== 'siteLayout')
        : prev,
  },
})
