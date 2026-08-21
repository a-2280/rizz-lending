import {defineArrayMember, defineField, defineType} from 'sanity'
import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'

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
            defineField({name: 'description', type: 'text'}),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'description'},
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
