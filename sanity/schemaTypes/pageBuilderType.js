import {defineArrayMember, defineType} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'estimationBlock'}),
    defineArrayMember({type: 'imageMarquee'}),
    defineArrayMember({type: 'threeCardBlock'}),
    defineArrayMember({type: 'highlightsBlock'}),
    defineArrayMember({type: 'testimonialsBlock'}),
    defineArrayMember({type: 'faqBlock'}),
    defineArrayMember({type: 'cta'}),
  ],
})
