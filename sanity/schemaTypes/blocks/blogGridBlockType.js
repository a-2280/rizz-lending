import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentsIcon} from '@sanity/icons/Documents'

export const blogGridBlockType = defineType({
  name: 'blogGridBlock',
  title: 'Blog Grid',
  type: 'object',
  icon: DocumentsIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'items', title: 'Posts'},
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
      name: 'items',
      title: 'Posts',
      type: 'array',
      group: 'items',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'post',
          fields: [
            defineField({name: 'photo', title: 'Image', type: 'image'}),
            defineField({
              name: 'eyebrow',
              title: 'Category',
              description: 'Short label above the title, e.g. "Borrow Smart", "Buyer guide", "Market".',
              type: 'string',
            }),
            defineField({
              name: 'heading',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'description', title: 'Excerpt', type: 'text'}),
            defineField({
              name: 'link',
              title: 'Post link',
              description: 'Where the card links to. Leave empty for a card that is not clickable.',
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
            select: {title: 'heading', subtitle: 'eyebrow', media: 'photo'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Blog Grid'}
    },
  },
})
