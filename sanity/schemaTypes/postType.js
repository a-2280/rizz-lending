import {defineArrayMember, defineField, defineType} from 'sanity'
import {EditIcon} from '@sanity/icons/Edit'

export const postType = defineType({
  name: 'post',
  title: 'Blog Posts',
  type: 'document',
  icon: EditIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      description: 'Short summary shown on blog cards and used as the page description.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      group: 'content',
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{type: 'blogCategory'}],
      group: 'content',
    }),
    defineField({
      name: 'author',
      type: 'string',
      group: 'content',
      initialValue: 'Steve Brownlee',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'image', name: 'image'}),
      ],
    }),
    defineField({
      name: 'showOnBlog',
      title: 'Show on Blog',
      type: 'boolean',
      group: 'settings',
      description: 'Controls whether this post appears on the public /blog page. Toggle on when it is ready to go live.',
      initialValue: false,
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Original WordPress URL',
      type: 'url',
      group: 'settings',
      readOnly: true,
      description: 'Preserved from the WordPress migration for reference and redirects.',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category.title', media: 'mainImage', showOnBlog: 'showOnBlog'},
    prepare({title, subtitle, media, showOnBlog}) {
      return {
        title,
        subtitle: [subtitle, showOnBlog ? 'Live' : 'Hidden'].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
