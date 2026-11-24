import {defineArrayMember, defineField} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

// Portable Text with an internal page reference or a URL. Reused by the rich
// text block and by the optional fields on existing prose blocks, so inline
// links can be added without changing the plain-text fields already in use.
export const proseTextMember = defineArrayMember({
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'H2', value: 'h2'},
    {title: 'H3', value: 'h3'},
  ],
  lists: [
    {title: 'Bullet', value: 'bullet'},
    {title: 'Numbered', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Strong', value: 'strong'},
      {title: 'Emphasis', value: 'em'},
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        icon: LinkIcon,
        fields: [
          defineField({
            name: 'linkType',
            title: 'Link type',
            type: 'string',
            options: {
              list: [
                {title: 'Page', value: 'page'},
                {title: 'URL', value: 'external'},
              ],
              layout: 'radio',
            },
            initialValue: 'external',
          }),
          defineField({
            name: 'page',
            title: 'Page',
            type: 'reference',
            to: [{type: 'page'}],
            hidden: ({parent}) => parent?.linkType !== 'page',
            validation: (rule) =>
              rule.custom((value, context) => {
                if (context.parent?.linkType === 'page' && !value) return 'Choose a page'
                return true
              }),
          }),
          defineField({
            name: 'href',
            title: 'URL',
            type: 'string',
            description: 'A site path (/lease-buyout, /#calculator) or a full https URL.',
            hidden: ({parent}) => parent?.linkType !== 'external',
            validation: (rule) =>
              rule.custom((value, context) => {
                if (context.parent?.linkType === 'external' && !value) return 'Add a URL'
                return true
              }),
          }),
        ],
      },
    ],
  },
})

export function proseField(name, title, description, group) {
  return defineField({
    name,
    title,
    type: 'array',
    description,
    ...(group ? {group} : {}),
    of: [proseTextMember],
  })
}
