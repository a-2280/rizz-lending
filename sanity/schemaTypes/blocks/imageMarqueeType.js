import { defineArrayMember, defineField, defineType} from 'sanity'
import {TransferIcon} from '@sanity/icons/Transfer'

export const imageMarqueeType = defineType({
  name: 'imageMarquee',
  title: 'Auto Scrolling Images',
  type: 'object',
  icon: TransferIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
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
      name: 'images',
      type: 'array',
      of: [defineArrayMember({ type: 'image' })],
      group: 'media',
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Image Marquee'}
    },
  },
})
