import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

export const pageType = defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Optional. When a field is empty, the site uses its built-in title and description for that page.',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Browser tab and search result title. 70 characters max.',
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: 'description',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          description: 'Search result description. 170 characters max.',
          validation: (rule) => rule.max(170),
        }),
        defineField({
          name: 'noindex',
          title: 'Hide from search engines',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'pageBuilder',
      type: 'pageBuilder',
    }),
  ],
})
