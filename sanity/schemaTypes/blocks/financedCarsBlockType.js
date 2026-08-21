import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const financedCarsBlockType = defineType({
  name: 'financedCarsBlock',
  title: 'Financed Cars',
  type: 'object',
  icon: ImageIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'cars', title: 'Cars'},
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
      title: 'Cars',
      type: 'array',
      group: 'cars',
      validation: (rule) => rule.max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'car',
          fields: [
            defineField({name: 'photo', title: 'Photo', type: 'image'}),
            defineField({name: 'photoCaption', title: 'Car name', type: 'string'}),
            defineField({name: 'photoSubcaption', title: "Caption", type: 'string'}),
          ],
          preview: {
            select: {title: 'photoCaption', subtitle: 'photoSubcaption', media: 'photo'},
          },
        }),
      ],
    }),
    defineField({
      name: 'note',
      title: 'Closing note',
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
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Financed Cars Block'}
    },
  },
})
