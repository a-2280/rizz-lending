import {defineArrayMember, defineField, defineType} from 'sanity'
import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'
import {LinkIcon} from '@sanity/icons/Link'

export const checklistBlockType = defineType({
  name: 'checklistBlock',
  title: 'Checklist',
  type: 'object',
  icon: CheckmarkCircleIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'items', title: 'Items'},
  ],
  fields: [
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'applyButton'}, {type: 'link', title: 'Custom button'}],
      validation: (rule) => rule.max(2),
      group: 'content',
    }),
    defineField({
      name: 'items',
      type: 'array',
      group: 'items',
      validation: (rule) => rule.max(8),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          fields: [
            defineField({name: 'heading', type: 'string'}),
            defineField({
              name: 'description',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [{title: 'Normal', value: 'normal'}],
                  lists: [],
                  marks: {
                    decorators: [],
                    annotations: [
                      {
                        name: 'checklistLink',
                        type: 'object',
                        title: 'Link',
                        icon: LinkIcon,
                        fields: [{name: 'href', title: 'URL', type: 'string'}],
                      },
                    ],
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {title: 'heading', description: 'description'},
            prepare({title, description}) {
              const subtitle =
                typeof description === 'string'
                  ? description
                  : (description || [])
                      .filter((block) => block._type === 'block')
                      .map((block) => (block.children || []).map((child) => child.text).join(''))
                      .join(' ')
              return {title, subtitle}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {firstItemHeading: 'items.0.heading'},
    prepare({firstItemHeading}) {
      return {title: firstItemHeading || 'Untitled', subtitle: 'Checklist Block'}
    },
  },
})
