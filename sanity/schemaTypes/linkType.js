import {defineField, defineType} from 'sanity'

export const linkType = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string'}),
    defineField({name: 'href', title: 'Link', type: 'string'}),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
