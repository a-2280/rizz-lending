import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {LinkIcon} from '@sanity/icons/Link'

export const faqBlockType = defineType({
  name: 'faqBlock',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({name: 'question', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'answer',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [{title: 'Normal', value: 'normal'}],
                  lists: [],
                  marks: {
                    decorators: [
                      {title: 'Bold', value: 'strong'},
                      {title: 'Italic', value: 'em'},
                    ],
                    annotations: [
                      {
                        name: 'faqLink',
                        type: 'object',
                        title: 'Link',
                        icon: LinkIcon,
                        fields: [{name: 'href', title: 'URL', type: 'string'}],
                      },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'question', answer: 'answer'},
            prepare({title, answer}) {
              const subtitle = (answer || [])
                .filter((block) => block._type === 'block')
                .map((block) => (block.children || []).map((child) => child.text).join(''))
                .join(' ')
              return {title, subtitle}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'FAQ'}
    },
  },
})
