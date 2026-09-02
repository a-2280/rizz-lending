import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'
import {ColorWheelIcon} from '@sanity/icons/ColorWheel'

export const imageHeroType = defineType({
  name: 'imageHero',
  title: 'Hero (with image)',
  type: 'object',
  icon: ImagesIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
  ],
  fields: [
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
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      const title = heading?.[0]?.children?.map((span) => span.text).join('')
      return {title: title || 'Untitled', subtitle: 'Image Hero'}
    },
  },
})
