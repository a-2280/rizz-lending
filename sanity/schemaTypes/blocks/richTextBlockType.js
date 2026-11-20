import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons/BlockContent'
import {proseTextMember} from '../proseText'

export const richTextBlockType = defineType({
  name: 'richTextBlock',
  title: 'Rich text',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [proseTextMember],
      description: 'Paragraphs can include links to a page or a URL.',
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Rich text'}
    },
  },
})
