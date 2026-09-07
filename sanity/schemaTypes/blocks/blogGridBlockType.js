import {defineField, defineType} from 'sanity'
import {DocumentsIcon} from '@sanity/icons/Documents'

export const blogGridBlockType = defineType({
  name: 'blogGridBlock',
  title: 'Blog Grid',
  type: 'object',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Blog Grid — lists live Blog Posts automatically'}
    },
  },
})
