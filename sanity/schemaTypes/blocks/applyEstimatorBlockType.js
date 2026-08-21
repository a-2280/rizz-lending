import {defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'

export const applyEstimatorBlockType = defineType({
  name: 'applyEstimatorBlock',
  title: 'Apply Estimator',
  type: 'object',
  icon: RocketIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'calculator', title: 'Calculator'},
  ],
  fields: [
    defineField({name: 'eyebrow', type: 'string', group: 'hero', initialValue: 'Apply now'}),
    defineField({name: 'heading', type: 'string', group: 'hero', initialValue: 'Get your amortized terms.'}),
    defineField({name: 'subText', title: 'Sub text', type: 'text', rows: 2, group: 'hero', initialValue: 'Estimate your payment below, then continue to the secure application.'}),
    defineField({name: 'calcEyebrow', title: 'Calculator eyebrow', type: 'string', group: 'calculator', initialValue: 'Estimate, then apply'}),
    defineField({name: 'calcHeading', title: 'Calculator heading', type: 'string', group: 'calculator', initialValue: 'Your New Lowest Payment'}),
    defineField({name: 'vehicleLabel', title: 'Vehicle field label', type: 'string', group: 'calculator', initialValue: 'Vehicle'}),
    defineField({name: 'vehiclePlaceholder', title: 'Vehicle field placeholder', type: 'string', group: 'calculator', initialValue: 'e.g. 2022 Lamborghini Huracán'}),
    defineField({
      name: 'minFinanced',
      title: 'Minimum amount financed',
      type: 'number',
      initialValue: 50000,
      validation: (Rule) => Rule.required().positive(),
      group: 'calculator',
    }),
    defineField({
      name: 'maxFinanced',
      title: 'Maximum amount financed',
      type: 'number',
      initialValue: 2000000,
      validation: (Rule) => Rule.required().positive().greaterThan(Rule.valueOfField('minFinanced')),
      group: 'calculator',
    }),
    defineField({name: 'apr', title: 'APR (%)', type: 'number', initialValue: 9.9, group: 'calculator'}),
    defineField({
      name: 'terms',
      title: 'Term options',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'months',
          fields: [defineField({name: 'months', type: 'number'})],
          preview: {
            select: {months: 'months'},
            prepare({months}) {
              return {title: months ? `${months} mo` : 'Untitled'}
            },
          },
        },
      ],
      initialValue: [{months: 120}, {months: 180}, {months: 240}],
      validation: (Rule) => Rule.required().min(1),
      group: 'calculator',
    }),
    defineField({name: 'continueLabel', title: 'Continue button label', type: 'string', group: 'calculator', initialValue: 'Continue to secure application'}),
    defineField({
      name: 'disclaimer',
      type: 'text',
      rows: 2,
      initialValue: 'Minimum 20% down. Illustrative only; rates, amortized terms, and approval depend on the vehicle, borrower, and loan amount. Not a rate quote.',
      validation: (Rule) => Rule.required(),
      group: 'calculator',
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Apply Estimator'}
    },
  },
})
