import {defineArrayMember, defineField, defineType} from 'sanity'
import {CreditCardIcon} from '@sanity/icons/CreditCard'

export const twoCardBlockType = defineType({
  name: 'twoCardBlock',
  title: 'Two Card Block (dark)',
  type: 'object',
  icon: CreditCardIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'cards', title: 'Cards'},
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
      name: 'cards',
      type: 'array',
      group: 'cards',
      validation: (rule) => rule.length(2),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'card',
          fields: [
            defineField({name: 'eyebrow', type: 'string'}),
            defineField({name: 'heading', type: 'string'}),
            defineField({name: 'description', type: 'text'}),
            defineField({
              name: 'link',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Link text', type: 'string'}),
                defineField({
                  name: 'linkType',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Page', value: 'page'},
                      {title: 'Custom URL', value: 'external'},
                    ],
                    layout: 'radio',
                  },
                  initialValue: 'page',
                }),
                defineField({
                  name: 'page',
                  type: 'reference',
                  to: [{type: 'page'}],
                  hidden: ({parent}) => parent?.linkType !== 'page',
                }),
                defineField({
                  name: 'href',
                  title: 'Custom URL',
                  type: 'string',
                  hidden: ({parent}) => parent?.linkType !== 'external',
                }),
              ],
              preview: {
                select: {label: 'label', linkType: 'linkType', pageTitle: 'page.title', href: 'href'},
                prepare({label, linkType, pageTitle, href}) {
                  return {
                    title: label || 'Untitled link',
                    subtitle: linkType === 'page' ? pageTitle : href,
                  }
                },
              },
            }),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'eyebrow'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Two Card Block'}
    },
  },
})
