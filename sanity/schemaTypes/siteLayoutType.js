import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteLayoutType = defineType({
  name: 'siteLayout',
  title: 'Site layout',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'footer',
      type: 'reference',
      to: [{type: 'footer'}],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site layout'}
    },
  },
})
