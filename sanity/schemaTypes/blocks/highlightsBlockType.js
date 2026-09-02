import {defineArrayMember, defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'

export const highlightsBlockType = defineType({
  name: 'highlightsBlock',
  title: 'Highlights',
  type: 'object',
  icon: StarIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'items', title: 'Items'},
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'description',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'items',
      type: 'array',
      group: 'items',
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          fields: [
            defineField({name: 'heading', type: 'string'}),
            defineField({name: 'description', type: 'text'}),
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
      return {title: heading || 'Untitled', subtitle: 'Highlights Block'}
    },
  },
})
