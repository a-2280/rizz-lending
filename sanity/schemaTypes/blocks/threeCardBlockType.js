import {defineArrayMember, defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'

export const threeCardBlockType = defineType({
  name: 'threeCardBlock',
  title: 'Cards (up to three cards)',
  type: 'object',
  icon: RocketIcon,
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
      validation: (rule) => rule.max(3),
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
                  type: 'url',
                  validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
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
      return {title: heading || 'Untitled', subtitle: 'Three Card Block'}
    },
  },
})
