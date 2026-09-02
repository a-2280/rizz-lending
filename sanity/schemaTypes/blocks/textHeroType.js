import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons/Text'
import {ColorWheelIcon} from '@sanity/icons/ColorWheel'

export const textHeroType = defineType({
  name: 'textHero',
  title: 'Hero (text only)',
  type: 'object',
  icon: TextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
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
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      const title = heading?.[0]?.children?.map((span) => span.text).join('')
      return {title: title || 'Untitled', subtitle: 'Text Hero'}
    },
  },
})
