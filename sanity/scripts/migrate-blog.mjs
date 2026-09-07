// One-off migration script: pulls published posts from the WordPress REST API
// at rizzlending.com and writes them into this Sanity dataset as `post` /
// `blogCategory` documents, uploading images along the way.
//
// Usage:
//   node sanity/scripts/migrate-blog.mjs            (dry run: fetch + transform, no writes)
//   node sanity/scripts/migrate-blog.mjs --commit    (writes categories, images and posts)

import {createClient} from '@sanity/client'
import {htmlToPortableText} from '@portabletext/html'
import {JSDOM} from 'jsdom'
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs'
import {homedir} from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const COMMIT = process.argv.includes('--commit')

const WP_BASE = 'https://rizzlending.com/wp-json/wp/v2'

// The 12 posts currently linked from the live /blog page. These start with
// showOnBlog=true; the remaining migrated posts start hidden and can be
// toggled on from Studio.
const SHOWN_SLUGS = new Set([
  'financing-supercars-jumbo-auto-loans-explained',
  'high-end-vehicle-financing-expert-guide',
  'audi-r8-v10-plus-financing-loans-lease-tips',
  'exotic-car-financing-rates-terms-tips',
  'supercar-financing-options-costs-tips',
  'collector-car-loans-rates-terms-tips',
  'classic-car-financing-options-tips',
  'luxury-auto-loans-guide-rates-terms-tips',
  'private-party-exotic-car-financing-complete-guide',
  'dealer-financing-for-exotic-cars-a-smart-guide',
  'ferrari-488-financing-guide-rizz-lending',
  'rizz-lending-audi-r8-v10-plus-financing',
])

function getToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN
  const configPath = path.join(homedir(), '.config', 'sanity', 'config.json')
  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  if (!config.authToken) throw new Error('No Sanity auth token found. Run `npx sanity login` inside sanity/.')
  return config.authToken
}

const client = createClient({
  projectId: 'gx0bybp7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: getToken(),
  useCdn: false,
})

// --- html/entity decoding helper (shared JSDOM instance) ---
const decoderDom = new JSDOM('<!doctype html><body><div id="d"></div></body>')
const decoderDiv = decoderDom.window.document.getElementById('d')
function htmlToText(html) {
  if (!html) return ''
  decoderDiv.innerHTML = html
  return decoderDiv.textContent.replace(/\s+/g, ' ').trim()
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '')
}

// Strip a WordPress resize suffix like `-840x473` to find the original asset,
// falling back to the given URL if the guess doesn't resolve.
const SIZE_SUFFIX = /-(\d+)x(\d+)(?=\.\w+(?:\?.*)?$)/
async function resolveOriginal(url) {
  const match = url.match(SIZE_SUFFIX)
  if (!match) return url
  const candidate = url.replace(SIZE_SUFFIX, '')
  try {
    const res = await fetch(candidate, {method: 'HEAD'})
    if (res.ok) return candidate
  } catch {
    // ignore, fall back below
  }
  return url
}

const REPORT = {posts: [], warnings: []}
const categoryIdCache = new Map()
const assetIdCache = new Map()
let keyCounter = 0
function genKey() {
  keyCounter += 1
  return `mig${keyCounter}${Math.random().toString(36).slice(2, 8)}`
}

async function uploadImage(url) {
  if (assetIdCache.has(url)) return assetIdCache.get(url)
  if (!COMMIT) {
    assetIdCache.set(url, `DRY-RUN-ASSET(${url})`)
    return assetIdCache.get(url)
  }
  const res = await fetch(url)
  if (!res.ok) {
    REPORT.warnings.push(`Failed to fetch image ${url}: ${res.status}`)
    return null
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  const filename = url.split('/').pop().split('?')[0]
  const asset = await client.assets.upload('image', buffer, {filename})
  assetIdCache.set(url, asset._id)
  return asset._id
}

async function ensureCategory(name) {
  if (categoryIdCache.has(name)) return categoryIdCache.get(name)
  const id = `blogCategory-${slugify(name)}`
  if (COMMIT) {
    await client.createIfNotExists({_id: id, _type: 'blogCategory', title: name})
  }
  categoryIdCache.set(name, id)
  return id
}

async function fetchAllPosts() {
  const res = await fetch(`${WP_BASE}/posts?per_page=100&_embed=1`)
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`)
  return res.json()
}

async function fetchMedia(id) {
  const res = await fetch(`${WP_BASE}/media/${id}`)
  if (!res.ok) return null
  return res.json()
}

function isEmptyBlock(block) {
  if (block._type !== 'block') return false
  return (block.children || []).every((child) => child._type === 'span' && !child.text.trim())
}

async function transformPost(p) {
  const slug = p.slug
  const title = htmlToText(p.title.rendered)
  const excerpt = htmlToText(p.excerpt.rendered)
  const categoryTerm = p._embedded?.['wp:term']?.[0]?.find((t) => t.taxonomy === 'category')
  const categoryName = categoryTerm ? htmlToText(categoryTerm.name) : 'Uncategorized'
  const categoryId = await ensureCategory(categoryName)

  // Resolve main image: real WP featured image first, else the first
  // in-content image (what Yoast was already using for og:image), else none.
  let mainImageUrl = null
  let mainImageFromContent = false
  if (p.featured_media) {
    const media = await fetchMedia(p.featured_media)
    if (media?.source_url) {
      mainImageUrl = await resolveOriginal(media.source_url)
    }
  }
  if (!mainImageUrl) {
    const og = p.yoast_head_json?.og_image?.[0]?.url
    if (og && !og.includes('rizz-logo-brand.jpg')) {
      mainImageUrl = await resolveOriginal(og)
      mainImageFromContent = true
    }
  }

  // Convert body HTML -> Portable Text. Images always land as the sole
  // inline child of their own block in this content (WP wraps every image in
  // its own <figure> or <p>), so every image block gets hoisted to a
  // top-level image object matching the `body` schema's array member.
  const rawBlocks = htmlToPortableText(p.content.rendered || '', {
    parseHtml: (html) => new JSDOM(html).window.document,
    keyGenerator: genKey,
    types: {
      image: ({value}) => (value.src ? {_key: genKey(), _type: 'image', src: value.src, alt: value.alt || ''} : undefined),
    },
  })

  const hoisted = []
  for (const block of rawBlocks) {
    if (block._type === 'block' && block.children?.length === 1 && block.children[0]._type === 'image') {
      hoisted.push({_key: block._key, _type: 'image', src: block.children[0].src, alt: block.children[0].alt})
    } else if (!isEmptyBlock(block)) {
      hoisted.push(block)
    }
  }

  // Resolve each hoisted image to its original asset URL up front so the
  // main-image de-dupe check below compares like with like.
  for (const block of hoisted) {
    if (block._type === 'image') {
      block.src = await resolveOriginal(block.src)
    }
  }

  // Avoid showing the same photo twice when the "main image" is really just
  // the first in-content image (no true WP featured image was set).
  if (mainImageFromContent) {
    const dupeIndex = hoisted.findIndex((b) => b._type === 'image' && b.src === mainImageUrl)
    if (dupeIndex !== -1) hoisted.splice(dupeIndex, 1)
  }

  const finalBlocks = []
  for (const block of hoisted) {
    if (block._type === 'image') {
      const assetId = await uploadImage(block.src)
      if (!assetId) {
        REPORT.warnings.push(`[${slug}] dropped unresolvable inline image ${block.src}`)
        continue
      }
      finalBlocks.push({_key: block._key, _type: 'image', asset: {_type: 'reference', _ref: assetId}})
    } else {
      finalBlocks.push(block)
    }
  }

  let mainImage
  if (mainImageUrl) {
    const assetId = await uploadImage(mainImageUrl)
    if (assetId) mainImage = {_type: 'image', asset: {_type: 'reference', _ref: assetId}}
  }

  const doc = {
    _id: `post-${p.id}`,
    _type: 'post',
    title,
    slug: {_type: 'slug', current: slug},
    excerpt: excerpt || undefined,
    mainImage,
    category: {_type: 'reference', _ref: categoryId},
    author: 'Steve Brownlee',
    publishedAt: p.date_gmt ? `${p.date_gmt}Z` : undefined,
    body: finalBlocks,
    showOnBlog: SHOWN_SLUGS.has(slug),
    sourceUrl: p.link,
  }

  REPORT.posts.push({
    id: p.id,
    slug,
    title,
    category: categoryName,
    hasMainImage: Boolean(mainImage),
    bodyBlocks: finalBlocks.length,
    inlineImages: finalBlocks.filter((b) => b._type === 'image').length,
    showOnBlog: doc.showOnBlog,
  })

  return doc
}

async function main() {
  console.log(COMMIT ? 'Running migration (COMMIT: writes will be made)...' : 'Running migration (DRY RUN: no writes)...')
  const posts = await fetchAllPosts()
  console.log(`Fetched ${posts.length} posts from WordPress`)

  const docs = []
  for (const p of posts) {
    try {
      const doc = await transformPost(p)
      docs.push(doc)
      if (COMMIT) {
        await client.createOrReplace(doc)
      }
      console.log(`${COMMIT ? 'Wrote' : 'Transformed'}: ${p.slug}`)
    } catch (err) {
      REPORT.warnings.push(`[${p.slug}] FAILED: ${err.message}`)
      console.error(`Failed ${p.slug}:`, err.message)
    }
  }

  const outDir = process.env.MIGRATION_REPORT_DIR || path.join(__dirname, '..', '..', 'migration-report')
  mkdirSync(outDir, {recursive: true})
  writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(REPORT, null, 2))
  writeFileSync(path.join(outDir, 'sample-doc.json'), JSON.stringify(docs[0], null, 2))

  console.log(`\nDone. ${docs.length} posts processed, ${REPORT.warnings.length} warnings.`)
  if (REPORT.warnings.length) {
    console.log('Warnings:')
    console.log(REPORT.warnings.join('\n'))
  }
  console.log(`\nCategories: ${[...categoryIdCache.keys()].join(', ')}`)
  console.log(`Report written to migration-report/report.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
