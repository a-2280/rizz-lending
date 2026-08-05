import {defineField, defineType} from 'sanity'

export const applyButtonType = defineType({
  name: 'applyButton',
  title: 'Apply now button',
  type: 'object',
  fields: [
    defineField({
      name: 'note',
      type: 'string',
      readOnly: true,
      initialValue: 'Editable through the Apply Now button component.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Apply now button'}
    },
  },
})
