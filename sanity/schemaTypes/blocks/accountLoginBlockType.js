import {defineField, defineType} from 'sanity'
import {LockIcon} from '@sanity/icons/Lock'

export const accountLoginBlockType = defineType({
  name: 'accountLoginBlock',
  title: 'Account Login',
  type: 'object',
  icon: LockIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'form', title: 'Login form'},
  ],
  fields: [
    defineField({name: 'eyebrow', type: 'string', group: 'hero'}),
    defineField({name: 'heading', type: 'string', group: 'hero'}),
    defineField({name: 'subText', title: 'Sub text', type: 'text', group: 'hero'}),
    defineField({name: 'loginHeading', title: 'Card heading', type: 'string', group: 'form', initialValue: 'Log in'}),
    defineField({name: 'loginSubtext', title: 'Card subtext', type: 'string', group: 'form', initialValue: 'Welcome back.'}),
    defineField({name: 'emailLabel', type: 'string', group: 'form', initialValue: 'Email'}),
    defineField({name: 'emailPlaceholder', type: 'string', group: 'form', initialValue: 'you@email.com'}),
    defineField({name: 'passwordLabel', type: 'string', group: 'form', initialValue: 'Password'}),
    defineField({name: 'loginButtonLabel', type: 'string', group: 'form', initialValue: 'Log in'}),
    defineField({name: 'forgotPasswordLink', title: 'Forgot password link', type: 'link', group: 'form', initialValue: {label: 'Forgot password?'}}),
    defineField({name: 'newCustomerLink', title: 'New customer link', type: 'link', group: 'form', initialValue: {label: 'New customer? Apply'}}),
    defineField({name: 'footerNote', title: 'Footer note', type: 'text', group: 'form'}),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Account Login'}
    },
  },
})
