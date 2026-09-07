import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

export const contactFormBlockType = defineType({
  name: 'contactFormBlock',
  title: 'Contact form',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({name: 'formHeading', type: 'string'}),
    defineField({name: 'formSubtext', type: 'string'}),
    defineField({name: 'submitLabel', type: 'string', initialValue: 'Send message'}),
  ],
  preview: {
    select: {title: 'formHeading'},
    prepare({title}) {
      return {title: title || 'Contact form'}
    },
  },
})
