import {defineArrayMember, defineField, defineType} from 'sanity'
import {EarthAmericasIcon} from '@sanity/icons/EarthAmericas'

const INITIAL_STATES = [
  {abbr: 'ME', name: 'Maine', status: 'available'},
  {abbr: 'VT', name: 'Vermont', status: 'unavailable'},
  {abbr: 'NH', name: 'New Hampshire', status: 'available'},
  {abbr: 'WA', name: 'Washington', status: 'available'},
  {abbr: 'ID', name: 'Idaho', status: 'available'},
  {abbr: 'MT', name: 'Montana', status: 'available'},
  {abbr: 'ND', name: 'North Dakota', status: 'available'},
  {abbr: 'MN', name: 'Minnesota', status: 'available'},
  {abbr: 'WI', name: 'Wisconsin', status: 'soon'},
  {abbr: 'MI', name: 'Michigan', status: 'soon'},
  {abbr: 'NY', name: 'New York', status: 'available'},
  {abbr: 'MA', name: 'Massachusetts', status: 'available'},
  {abbr: 'OR', name: 'Oregon', status: 'available'},
  {abbr: 'NV', name: 'Nevada', status: 'unavailable'},
  {abbr: 'WY', name: 'Wyoming', status: 'available'},
  {abbr: 'SD', name: 'South Dakota', status: 'unavailable'},
  {abbr: 'IA', name: 'Iowa', status: 'available'},
  {abbr: 'IL', name: 'Illinois', status: 'available'},
  {abbr: 'IN', name: 'Indiana', status: 'available'},
  {abbr: 'OH', name: 'Ohio', status: 'soon'},
  {abbr: 'PA', name: 'Pennsylvania', status: 'available'},
  {abbr: 'NJ', name: 'New Jersey', status: 'available'},
  {abbr: 'CT', name: 'Connecticut', status: 'available'},
  {abbr: 'CA', name: 'California', status: 'available'},
  {abbr: 'UT', name: 'Utah', status: 'available'},
  {abbr: 'CO', name: 'Colorado', status: 'available'},
  {abbr: 'NE', name: 'Nebraska', status: 'available'},
  {abbr: 'MO', name: 'Missouri', status: 'soon'},
  {abbr: 'KY', name: 'Kentucky', status: 'available'},
  {abbr: 'WV', name: 'West Virginia', status: 'unavailable'},
  {abbr: 'VA', name: 'Virginia', status: 'unavailable'},
  {abbr: 'MD', name: 'Maryland', status: 'unavailable'},
  {abbr: 'DC', name: 'District of Columbia', status: 'unavailable'},
  {abbr: 'DE', name: 'Delaware', status: 'available'},
  {abbr: 'RI', name: 'Rhode Island', status: 'unavailable'},
  {abbr: 'AZ', name: 'Arizona', status: 'available'},
  {abbr: 'NM', name: 'New Mexico', status: 'available'},
  {abbr: 'KS', name: 'Kansas', status: 'available'},
  {abbr: 'AR', name: 'Arkansas', status: 'unavailable'},
  {abbr: 'TN', name: 'Tennessee', status: 'unavailable'},
  {abbr: 'NC', name: 'North Carolina', status: 'soon'},
  {abbr: 'SC', name: 'South Carolina', status: 'available'},
  {abbr: 'OK', name: 'Oklahoma', status: 'soon'},
  {abbr: 'LA', name: 'Louisiana', status: 'available'},
  {abbr: 'MS', name: 'Mississippi', status: 'unavailable'},
  {abbr: 'AL', name: 'Alabama', status: 'unavailable'},
  {abbr: 'GA', name: 'Georgia', status: 'unavailable'},
  {abbr: 'HI', name: 'Hawaii', status: 'unavailable'},
  {abbr: 'AK', name: 'Alaska', status: 'unavailable'},
  {abbr: 'TX', name: 'Texas', status: 'available'},
  {abbr: 'FL', name: 'Florida', status: 'available'},
]

export const availabilityMapBlockType = defineType({
  name: 'availabilityMapBlock',
  title: 'Availability Map',
  type: 'object',
  icon: EarthAmericasIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'states', title: 'State availability'},
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'description',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{type: 'applyButton'}, {type: 'link', title: 'Custom button'}],
      validation: (rule) => rule.max(2),
      group: 'content',
    }),
    defineField({
      name: 'states',
      title: 'State availability',
      type: 'array',
      group: 'states',
      description: 'Status per state/territory. Verify against the licensing sheet — compliance sign-off is required before launch.',
      validation: (rule) => rule.max(51),
      initialValue: INITIAL_STATES,
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stateAvailability',
          fields: [
            defineField({name: 'abbr', title: 'Abbreviation', type: 'string', readOnly: true}),
            defineField({name: 'name', type: 'string', readOnly: true}),
            defineField({
              name: 'status',
              type: 'string',
              options: {
                list: [
                  {title: 'Lending available', value: 'available'},
                  {title: 'Coming soon', value: 'soon'},
                  {title: 'Lending unavailable', value: 'unavailable'},
                ],
                layout: 'radio',
              },
              initialValue: 'unavailable',
            }),
            defineField({
              name: 'note',
              title: 'Note (optional)',
              type: 'string',
              description: 'Shown in the hover tooltip, e.g. "Launching Q1 2027".',
              hidden: ({parent}) => parent?.status !== 'soon',
            }),
          ],
          preview: {
            select: {name: 'name', status: 'status'},
            prepare({name, status}) {
              return {title: name, subtitle: status}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: heading || 'Untitled', subtitle: 'Availability Map Block'}
    },
  },
})
