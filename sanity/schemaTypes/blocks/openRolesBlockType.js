import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

export const openRolesBlockType = defineType({
  name: 'openRolesBlock',
  title: 'Open Roles',
  type: 'object',
  icon: CaseIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'roles', title: 'Roles'},
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
      name: 'items',
      title: 'Roles',
      type: 'array',
      group: 'roles',
      validation: (rule) => rule.max(12),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'role',
          fields: [
            defineField({name: 'heading', title: 'Role title', type: 'string'}),
            defineField({name: 'description', title: 'Location / type', type: 'text'}),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'description'},
          },
        }),
      ],
    }),
    defineField({
      name: 'note',
      title: 'Empty-state note',
      description: 'Shown in place of the roles list when there are no open roles.',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'applyButton'}, {type: 'link', title: 'Custom button'}],
      validation: (rule) => rule.max(2),
      group: 'content',
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Open Roles Block'}
    },
  },
})
