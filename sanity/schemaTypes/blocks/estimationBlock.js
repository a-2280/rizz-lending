import { defineField, defineType} from 'sanity'
import {BillIcon} from '@sanity/icons/Bill'

export const estimationBlockType = defineType({
  name: 'estimationBlock',
  title: 'Price Estimator',
  type: 'object',
  icon: BillIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'estimator', title: 'Estimator'},
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
      name: 'subText',
      title: 'Subtext',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'details',
      title: 'Key details',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'detail',
          fields: [
            defineField({name: 'value', title: 'Value', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
          ],
          preview: {
            select: {title: 'value', subtitle: 'label'},
          },
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'calcEyebrow',
      title: 'Calculator eyebrow',
      type: 'string',
      group: 'estimator',
    }),
    defineField({
      name: 'calcHeading',
      title: 'Calculator heading',
      type: 'string',
      group: 'estimator',
    }),
    defineField({
      name: 'minFinanced',
      title: 'Minimum amount financed',
      type: 'number',
      initialValue: 50000,
      validation: (Rule) => Rule.required().positive(),
      group: 'estimator',
    }),
    defineField({
      name: 'maxFinanced',
      title: 'Maximum amount financed',
      type: 'number',
      initialValue: 2000000,
      validation: (Rule) => Rule.required().positive().greaterThan(Rule.valueOfField('minFinanced')),
      group: 'estimator',
    }),
    defineField({
      name: 'apr',
      title: 'APR (%)',
      type: 'number',
      initialValue: 9.9,
      group: 'estimator',
    }),
    defineField({
      name: 'terms',
      title: 'Term options',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'months',
          fields: [
            defineField({name: 'months', type: 'number'}),
          ],
          preview: {
            select: {months: 'months'},
            prepare({months}) {
              return {title: months ? `${months} mo` : 'Untitled'}
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      group: 'estimator',
    }),
    defineField({
      name: 'disclaimer',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
      group: 'estimator',
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Price Estimator'}
    },
  },
})
