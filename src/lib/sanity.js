import { createClient, groq } from 'next-sanity';

export const client = createClient({
  projectId: 'gx0bybp7',
  dataset: 'production',
  apiVersion: '2026-07-17',
  useCdn: true,
});

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
  buttons[]{ _key, _type, label, linkType, href, "pageSlug": page->slug.current },
  disclaimer,
  note,
  showIcon,
  theme,
  layout,
  image{ asset->{ url } },
  video{ asset->{ url } },
  images[]{ _key, asset->{ url } },
  details[]{ value, label },
  calcEyebrow,
  calcHeading,
  minFinanced,
  maxFinanced,
  apr,
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
    link{ label, linkType, href, "pageSlug": page->slug.current }
  },
  items[]{
    _key,
    heading,
    description,
    eyebrow,
    quote,
    attribution,
    photo{ asset->{ url } },
    photoCaption,
    photoSubcaption,
    question,
    answer,
    link{ label, linkType, href, "pageSlug": page->slug.current }
  },
  logos[]{
    _key,
    brand,
    logo{ asset->{ url, metadata{ dimensions{ width, height } } } }
  },
  states[]{ abbr, name, status, note }
}`;

const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  ${PAGE_BUILDER_FIELDS}
}`;

const POST_LIST_QUERY = groq`*[_type == "post" && showOnBlog == true] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  excerpt,
  mainImage{ asset->{ url } },
  "category": category->title,
  publishedAt
}`;

const POST_QUERY = groq`*[_type == "post" && showOnBlog == true && slug.current == $slug][0]{
  title,
  excerpt,
  mainImage{ asset->{ url } },
  "category": category->title,
  author,
  publishedAt,
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

export function getFooter() {
  return client.fetch(FOOTER_QUERY, {}, { next: { revalidate: 60 } });
}

export function getBlogPosts() {
  return client.fetch(POST_LIST_QUERY, {}, { next: { revalidate: 60 } });
}

export function getBlogPost(slug) {
  return client.fetch(POST_QUERY, { slug }, { next: { revalidate: 60 } });
}
