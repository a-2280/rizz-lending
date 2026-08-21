import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

export const leadershipStoryBlockType = defineType({
  name: 'leadershipStoryBlock',
  title: 'Leadership Story Block',
  type: 'object',
  icon: UsersIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'card', title: 'Card'},
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
      name: 'card',
      title: 'Card',
      type: 'object',
      group: 'card',
      fields: [
        defineField({name: 'eyebrow', type: 'string'}),
        defineField({name: 'name', title: 'Name', type: 'string'}),
        defineField({name: 'bio', type: 'text'}),
      ],
      preview: {
        select: {title: 'name', subtitle: 'eyebrow'},
      },
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Leadership Story Block'}
    },
  },
})
