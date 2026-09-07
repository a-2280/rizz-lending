import {defineField, defineType} from 'sanity'
import {InboxIcon} from '@sanity/icons/Inbox'
import {ColorWheelIcon} from '@sanity/icons/ColorWheel'

export const heroFormBlockType = defineType({
  name: 'heroFormBlock',
  title: 'Hero (with contact form)',
  type: 'object',
  icon: InboxIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'form', title: 'Form'},
  ],
  fields: [
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
      name: 'eyebrow',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'eyebrowColor',
      title: 'Eyebrow color',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Orange', value: 'orange'},
          {title: 'Light grey', value: 'light'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'orange',
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
    defineField({
      name: 'hubspotForm',
      title: 'HubSpot form',
      description: 'Which HubSpot form submissions go to.',
      type: 'string',
      group: 'form',
      options: {
        list: [
          {title: 'Dealer / Partner form', value: 'dealer'},
          {title: 'Careers form', value: 'careers'},
        ],
        layout: 'radio',
      },
      initialValue: 'dealer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'entityLabel',
      title: 'Entity label',
      description: 'Used in the name/type field labels, e.g. "Dealership" or "Business".',
      type: 'string',
      group: 'form',
      initialValue: 'Dealership',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showEntityType',
      title: 'Show entity type field',
      description: 'Shows the type dropdown (Franchise, Independent, Marketplace, Broker).',
      type: 'boolean',
      group: 'form',
      initialValue: true,
    }),
    defineField({
      name: 'showVolume',
      title: 'Show monthly volume field',
      description: 'Shows the "Monthly exotic volume" dropdown.',
      type: 'boolean',
      group: 'form',
      initialValue: true,
    }),
    defineField({name: 'formHeading', type: 'string', group: 'form'}),
    defineField({name: 'formSubtext', type: 'string', group: 'form'}),
    defineField({name: 'submitLabel', type: 'string', group: 'form', initialValue: 'Submit inquiry'}),
  ],
  preview: {
    select: {heading: 'heading', hubspotForm: 'hubspotForm'},
    prepare({heading, hubspotForm}) {
      const title = heading?.[0]?.children?.map((span) => span.text).join('')
      return {title: title || 'Untitled', subtitle: `Hero + Form (${hubspotForm || 'dealer'})`}
    },
  },
})
