import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {LinkIcon} from '@sanity/icons/Link'
import {ThListIcon} from '@sanity/icons/ThList'

export const legalBlockType = defineType({
  name: 'legalBlock',
  title: 'Legal / Policy',
  type: 'object',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'items', title: 'Sections'},
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heading',
      title: 'Page title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last modified',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'items',
      title: 'Sections',
      type: 'array',
      group: 'items',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          fields: [
            defineField({name: 'heading', type: 'string'}),
            defineField({
              name: 'description',
              title: 'Body',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'Subheading', value: 'h3'},
                  ],
                  lists: [
                    {title: 'Bullet', value: 'bullet'},
                    {title: 'Numbered', value: 'number'},
                  ],
                  marks: {
                    decorators: [
                      {title: 'Bold', value: 'strong'},
                      {title: 'Italic', value: 'em'},
                    ],
                    annotations: [
                      {
                        name: 'policyLink',
                        type: 'object',
                        title: 'Link',
                        icon: LinkIcon,
                        fields: [{name: 'href', title: 'URL', type: 'string'}],
                      },
                    ],
                  },
                },
                defineArrayMember({
                  type: 'object',
                  name: 'definitionTable',
                  title: 'Definition list',
                  icon: ThListIcon,
                  fields: [
                    defineField({name: 'caption', type: 'string'}),
                    defineField({
                      name: 'rows',
                      type: 'array',
                      of: [
                        defineArrayMember({
                          type: 'object',
                          name: 'row',
                          fields: [
                            defineField({name: 'term', type: 'string'}),
                            defineField({name: 'definition', type: 'text', rows: 4}),
                          ],
                          preview: {
                            select: {title: 'term', subtitle: 'definition'},
                          },
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: {caption: 'caption', rows: 'rows'},
                    prepare({caption, rows}) {
                      return {
                        title: caption || 'Definition list',
                        subtitle: `${rows?.length || 0} rows`,
                      }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'heading'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Legal / Policy'}
    },
  },
})
