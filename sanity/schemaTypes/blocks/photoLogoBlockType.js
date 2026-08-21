import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const photoLogoBlockType = defineType({
  name: 'photoLogoBlock',
  title: 'Photo & Logo Grid',
  type: 'object',
  icon: ImageIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'photos', title: 'Photos'},
    {name: 'logos', title: 'Logos'},
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
      title: 'Photos',
      type: 'array',
      group: 'photos',
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'car',
          fields: [
            defineField({name: 'photo', title: 'Photo', type: 'image'}),
            defineField({name: 'photoCaption', title: 'Car name', type: 'string'}),
          ],
          preview: {
            select: {title: 'photoCaption', media: 'photo'},
          },
        }),
      ],
    }),
    defineField({
      name: 'logos',
      title: 'Marque logos',
      type: 'array',
      group: 'logos',
      validation: (rule) => rule.max(20),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'marque',
          fields: [
            defineField({name: 'brand', title: 'Brand name', type: 'string'}),
            defineField({name: 'logo', title: 'Logo image', type: 'image'}),
          ],
          preview: {
            select: {title: 'brand', media: 'logo'},
          },
        }),
      ],
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
      return {title: heading || 'Untitled', subtitle: 'Photo & Logo Grid Block'}
    },
  },
})
