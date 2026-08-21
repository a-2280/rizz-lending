import {defineArrayMember, defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'

export const iconCardsBlockType = defineType({
  name: 'iconCardsBlock',
  title: 'Icon Cards',
  type: 'object',
  icon: RocketIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'cards', title: 'Cards'},
  ],
  fields: [
    defineField({
      name: 'theme',
      type: 'string',
      group: 'content',
      options: {list: ['light', 'dark']},
      initialValue: 'light',
    }),
    defineField({
      name: 'layout',
      type: 'string',
      group: 'content',
      options: {list: ['grid', 'split']},
      initialValue: 'grid',
      description: 'Grid: content above cards in a grid. Split: content beside a single stacked column of cards.',
    }),
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
      name: 'quote',
      title: 'Closing quote',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'applyButton'}, {type: 'link', title: 'Custom button'}],
      validation: (rule) => rule.max(2),
      group: 'content',
    }),
    defineField({
      name: 'cards',
      type: 'array',
      group: 'cards',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'card',
          fields: [
            defineField({name: 'marker', title: 'Marker (e.g. 01, →, ◆)', type: 'string'}),
            defineField({name: 'heading', type: 'string'}),
            defineField({name: 'description', type: 'text'}),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'marker'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Icon Cards Block'}
    },
  },
})
