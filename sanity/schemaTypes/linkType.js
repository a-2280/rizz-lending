import {defineField, defineType} from 'sanity'

export const linkType = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string'}),
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
      return {title: label || 'Untitled link', subtitle: linkType === 'page' ? pageTitle : href}
    },
  },
})
