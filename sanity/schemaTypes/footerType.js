import {defineArrayMember, defineField, defineType} from 'sanity'
import {InsertBelowIcon} from '@sanity/icons/InsertBelow'
import {ImageIcon} from '@sanity/icons/Image'
import {PlayIcon} from '@sanity/icons/Play'
import {VideoIcon} from '@sanity/icons/Video'
import {TwitterIcon} from '@sanity/icons/Twitter'
import {LinkedinIcon} from '@sanity/icons/Linkedin'

const PLATFORM_ICONS = {
  instagram: ImageIcon,
  youtube: PlayIcon,
  tiktok: VideoIcon,
  x: TwitterIcon,
  linkedin: LinkedinIcon,
}

export const footerType = defineType({
  name: 'footer',
  title: 'Footers',
  type: 'document',
  icon: InsertBelowIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'For internal use only, not shown on the site.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
    }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'X', value: 'x'},
                  {title: 'LinkedIn', value: 'linkedin'},
                ],
                layout: 'dropdown',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'href', title: 'Link', type: 'string'}),
          ],
          preview: {
            select: {platform: 'platform', href: 'href'},
            prepare({platform, href}) {
              return {
                title: platform || 'Untitled',
                subtitle: href,
                media: PLATFORM_ICONS[platform],
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Link columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({name: 'heading', type: 'string'}),
            defineField({
              name: 'links',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'footerLink',
                  fields: [
                    defineField({name: 'label', title: 'Link text', type: 'string'}),
                    defineField({
                      name: 'page',
                      type: 'reference',
                      to: [{type: 'page'}],
                    }),
                  ],
                  preview: {
                    select: {label: 'label', pageTitle: 'page.title'},
                    prepare({label, pageTitle}) {
                      return {
                        title: label || 'Untitled link',
                        subtitle: pageTitle,
                      }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'heading'},
          },
        }),
      ],
    }),
    defineField({
      name: 'legalText',
      title: 'Legal text',
      type: 'text',
      rows: 2,
    }),
  ],
})
