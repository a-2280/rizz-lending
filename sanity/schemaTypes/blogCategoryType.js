import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

export const blogCategoryType = defineType({
  name: 'blogCategory',
  title: 'Blog Categories',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
