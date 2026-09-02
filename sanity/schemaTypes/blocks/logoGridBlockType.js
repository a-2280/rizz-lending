import {defineArrayMember, defineField, defineType} from 'sanity'
import {TagsIcon} from '@sanity/icons/Tags'

export const logoGridBlockType = defineType({
  name: 'logoGridBlock',
  title: 'Logo Marquee',
  type: 'object',
  icon: TagsIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
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
      name: 'logos',
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
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Logo Marquee'}
    },
  },
})
