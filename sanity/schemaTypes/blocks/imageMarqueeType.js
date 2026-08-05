import { defineArrayMember, defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'

export const imageMarqueeType = defineType({
  name: 'imageMarquee',
  title: 'Auto Scrolling Images',
  type: 'object',
  icon: RocketIcon,
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
