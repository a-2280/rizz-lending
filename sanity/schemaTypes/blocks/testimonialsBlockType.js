import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockquoteIcon} from '@sanity/icons/Blockquote'

export const testimonialsBlockType = defineType({
  name: 'testimonialsBlock',
  title: 'Testimonials',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'items',
      type: 'array',
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'testimonial',
          fields: [
            defineField({name: 'eyebrow', type: 'string'}),
            defineField({name: 'quote', type: 'text'}),
            defineField({name: 'attribution', type: 'string'}),
            defineField({name: 'photo', type: 'image'}),
            defineField({name: 'photoCaption', type: 'string'}),
            defineField({name: 'photoSubcaption', type: 'string'}),
          ],
          preview: {
            select: {title: 'attribution', subtitle: 'quote'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Testimonials', subtitle: 'Testimonials Block'}
    },
  },
})
