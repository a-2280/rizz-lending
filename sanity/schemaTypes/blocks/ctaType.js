import {defineField, defineType} from 'sanity'
import {LaunchIcon} from '@sanity/icons/Launch'

export const ctaType = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({name: 'heading', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'subText', title: 'Subtext', type: 'text', rows: 2}),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'applyButton'}, {type: 'link', title: 'Custom button'}],
      validation: (Rule) => Rule.max(1),
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'CTA'}
    },
  },
})
