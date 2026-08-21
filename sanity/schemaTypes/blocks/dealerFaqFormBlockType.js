import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

export const dealerFaqFormBlockType = defineType({
  name: 'dealerFaqFormBlock',
  title: 'Dealer FAQ + Partner Form',
  type: 'object',
  icon: UsersIcon,
  groups: [
    {name: 'faq', title: 'FAQ', default: true},
    {name: 'form', title: 'Form'},
  ],
  fields: [
    defineField({name: 'eyebrow', type: 'string', group: 'faq'}),
    defineField({name: 'heading', type: 'string', group: 'faq'}),
    defineField({name: 'description', type: 'text', group: 'faq'}),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      group: 'faq',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({name: 'question', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'answer', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
          ],
          preview: {
            select: {title: 'question', subtitle: 'answer'},
          },
        }),
      ],
    }),
    defineField({name: 'formHeading', type: 'string', group: 'form'}),
    defineField({name: 'formSubtext', type: 'string', group: 'form'}),
    defineField({name: 'submitLabel', type: 'string', group: 'form', initialValue: 'Submit inquiry'}),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Dealer FAQ + Form'}
    },
  },
})
