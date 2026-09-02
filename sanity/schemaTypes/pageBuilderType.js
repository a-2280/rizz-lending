import {defineArrayMember, defineType} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'textHero'}),
    defineArrayMember({type: 'estimationBlock'}),
    defineArrayMember({type: 'estimatorHero'}),
    defineArrayMember({type: 'imageHero'}),
    defineArrayMember({type: 'imageMarquee'}),
    defineArrayMember({type: 'threeCardBlock'}),
    defineArrayMember({type: 'twoCardBlock'}),
    defineArrayMember({type: 'iconCardsBlock'}),
    defineArrayMember({type: 'leadershipStoryBlock'}),
    defineArrayMember({type: 'checklistBlock'}),
    defineArrayMember({type: 'highlightsBlock'}),
    defineArrayMember({type: 'testimonialsBlock'}),
    defineArrayMember({type: 'faqBlock'}),
    defineArrayMember({type: 'dealerFaqFormBlock'}),
    defineArrayMember({type: 'cta'}),
    defineArrayMember({type: 'logoGridBlock'}),
    defineArrayMember({type: 'financedCarsBlock'}),
    defineArrayMember({type: 'photoLogoBlock'}),
    defineArrayMember({type: 'openRolesBlock'}),
    defineArrayMember({type: 'availabilityMapBlock'}),
    defineArrayMember({type: 'legalBlock'}),
    defineArrayMember({type: 'blogGridBlock'}),
  ],
  options: {
    insertMenu: {
      groups: [
        {name: 'heroes', title: 'Heroes', of: ['hero', 'textHero', 'imageHero', 'estimatorHero']},
        {
          name: 'content',
          title: 'Content & Cards',
          of: [
            'threeCardBlock',
            'twoCardBlock',
            'iconCardsBlock',
            'checklistBlock',
            'highlightsBlock',
            'leadershipStoryBlock',
          ],
        },
        {name: 'calculators', title: 'Calculator', of: ['estimationBlock']},
        {
          name: 'proof',
          title: 'Proof & Logos',
          of: [
            'testimonialsBlock',
            'logoGridBlock',
            'photoLogoBlock',
            'imageMarquee',
            'financedCarsBlock',
          ],
        },
        {name: 'forms', title: 'FAQ & Forms', of: ['faqBlock', 'dealerFaqFormBlock']},
        {
          name: 'listings',
          title: 'Listings',
          of: ['blogGridBlock', 'openRolesBlock', 'availabilityMapBlock'],
        },
        {name: 'closers', title: 'Conversion & Legal', of: ['cta', 'legalBlock']},
      ],
      views: [
        {
          name: 'grid',
          previewImageUrl: (schemaTypeName) => `/static/preview-${schemaTypeName}.png`,
        },
        {name: 'list'},
      ],
    },
  },
})
