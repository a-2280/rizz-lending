import { createClient, groq } from 'next-sanity';
import { projectId, dataset, apiVersion } from './sanity-config';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const rich = (field) => `${field}[]{
  ...,
  markDefs[]{
    ...,
    _type == "link" => { "pageSlug": page->slug.current }
  }
}`;

const PAGE_BUILDER_FIELDS = `pageBuilder[]{
  _key,
  _type,
  eyebrow,
  eyebrowColor,
  heading,
  lastUpdated,
  description,
  quote,
  subText,
  ${rich('body')},
  ${rich('richSubText')},
  ${rich('richDescription')},
  ${rich('richQuote')},
  buttons[]{ _key, _type, label, linkType, href, "pageSlug": page->slug.current },
  disclaimer,
  note,
  showIcon,
  theme,
  layout,
  image{ asset->{ url } },
  video{ asset->{ url } },
  images[]{ _key, alt, asset->{ url } },
  details[]{ value, label },
  calcEyebrow,
  calcHeading,
  minFinanced,
  maxFinanced,
  "apr": coalesce(apr, 9.99),
  terms[]{ months },
  calcDisclaimer,
  formHeading,
  formSubtext,
  submitLabel,
  hubspotForm,
  entityLabel,
  showEntityType,
  showVolume,
  loginHeading,
  loginSubtext,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  loginButtonLabel,
  forgotPasswordLink{ label, linkType, href, "pageSlug": page->slug.current },
  newCustomerLink{ label, linkType, href, "pageSlug": page->slug.current },
  footerNote,
  vehicleLabel,
  vehiclePlaceholder,
  continueLabel,
  card{ eyebrow, name, bio },
  cards[]{
    _key,
    eyebrow,
    marker,
    heading,
    description,
    ${rich('richDescription')},
    link{ label, linkType, href, "pageSlug": page->slug.current }
  },
  items[]{
    _key,
    heading,
    description,
    eyebrow,
    quote,
    attribution,
    photo{ alt, asset->{ url } },
    photoCaption,
    photoSubcaption,
    question,
    answer,
    link{ label, linkType, href, "pageSlug": page->slug.current }
  },
  logos[]{
    _key,
    brand,
    logo{ asset->{ _id, url, metadata{ dimensions{ width, height } } } },
    link{ label, linkType, href, "pageSlug": page->slug.current }
  },
  states[]{ abbr, name, status, note }
}`;

const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  seo{ title, description, noindex },
  ${PAGE_BUILDER_FIELDS}
}`;

const POST_LIST_QUERY = groq`*[_type == "post" && showOnBlog == true] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  excerpt,
  mainImage{ asset->{ url } },
  "category": category->title,
  publishedAt,
  _updatedAt
}`;

const PAGE_DATES_QUERY = groq`*[_type == "page" && defined(slug.current) && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  _updatedAt
}`;

const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  excerpt,
  mainImage{ asset->{ url } },
  "category": category->title,
  author,
  publishedAt,
  _updatedAt,
  body[]{
    ...,
    _type == "image" => { "asset": asset->{ url } }
  }
}`;

const FOOTER_QUERY = groq`*[_id == "siteLayout"][0].footer->{
  tagline,
  socials[]{ _key, platform, href },
  columns[]{ _key, heading, links[]{ _key, label, linkType, href, "pageSlug": page->slug.current } },
  legalText
}`;

export function getPage(slug) {
  return client.fetch(PAGE_QUERY, { slug }, { next: { revalidate: 60 } });
}

export function getPageDates() {
  return client.fetch(PAGE_DATES_QUERY, {}, { next: { revalidate: 60 } });
}

export function getFooter() {
  return client.fetch(FOOTER_QUERY, {}, { next: { revalidate: 60 } });
}

export function getBlogPosts() {
  return client.fetch(POST_LIST_QUERY, {}, { next: { revalidate: 60 } });
}

export function getBlogPost(slug) {
  return client.fetch(POST_QUERY, { slug }, { next: { revalidate: 60 } });
}
