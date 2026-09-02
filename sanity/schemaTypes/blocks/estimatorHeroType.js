import {defineField, defineType, defineArrayMember} from 'sanity'
import {PresentationIcon} from '@sanity/icons/Presentation'
import {ColorWheelIcon} from '@sanity/icons/ColorWheel'

export const estimatorHeroType = defineType({
  name: 'estimatorHero',
  title: 'Hero (with estimator calculator)',
  type: 'object',
  icon: PresentationIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'estimator', title: 'Estimator'},
    {name: 'disclaimer', title: 'Disclaimer'},
  ],
  fields: [
    defineField({
      name: 'image',
      title: 'Image (Fallback for video)',
      type: 'image',
      group: 'media',
    }),
    defineField({
      name: 'video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      group: 'media',
    }),
    defineField({
      name: 'eyebrow',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heading',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: 'textColor',
                type: 'object',
                title: 'Color',
                icon: ColorWheelIcon,
                fields: [
                  {
                    name: 'color',
                    type: 'string',
                    options: {list: [{title: 'Flame bright', value: 'flame-bright'}]},
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'subText',
      title: 'Sub text',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'applyButton'}, {type: 'link', title: 'Custom button'}],
      validation: (Rule) => Rule.max(2),
      group: 'content',
    }),
    defineField({
      name: 'showIcon',
      title: 'Show checkmark icon',
      type: 'boolean',
      initialValue: true,
      group: 'disclaimer',
    }),
    defineField({
      name: 'disclaimer',
      title: 'Disclaimer text',
      type: 'array',
      group: 'disclaimer',
      of: [{type: 'block'}],
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
        defineArrayMember({
          type: 'object',
          name: 'months',
          fields: [defineField({name: 'months', type: 'number'})],
          preview: {
            select: {months: 'months'},
            prepare({months}) {
              return {title: months ? `${months} mo` : 'Untitled'}
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
      group: 'estimator',
    }),
    defineField({
      name: 'calcDisclaimer',
      title: 'Calculator disclaimer',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
      group: 'estimator',
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      const title = heading?.[0]?.children?.map((span) => span.text).join('')
      return {title: title || 'Untitled', subtitle: 'Hero + Estimator'}
    },
  },
})
