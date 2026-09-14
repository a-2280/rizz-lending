// One-off: applies the client's copy-audit fixes to page content (published docs and any drafts).
//
// Usage:
//   node sanity/scripts/copy-edits.mjs            (dry run: prints every change, no writes)
//   node sanity/scripts/copy-edits.mjs --commit    (writes the changes)

import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import path from 'node:path'

const COMMIT = process.argv.includes('--commit')

// slug -> [from, to, expected occurrences (default 1)], matched within pageBuilder only
const EDITS = {
  overview: [
    [
      'The more you put down the lower your monthly payment.',
      'The more you put down, the lower your monthly payment.',
    ],
    [" — it won't affect your credit score.", ". It won't affect your credit score."],
    ["isn't a compromise — it's a strategy.", "isn't a compromise. It's a strategy."],
    ['Refinance and pull cash out — keep the keys', 'Refinance and pull cash out. Keep the keys'],
    ['options we offer — pull equity out', 'options we offer: pull equity out'],
  ],
  'cash-out-refinance': [
    [" — it won't affect your credit score.", ". It won't affect your credit score."],
    ['Refinance and pull cash out — keep the keys', 'Refinance and pull cash out. Keep the keys'],
    ['no prepayment penalty — structured around', 'no prepayment penalty, structured around'],
  ],
  'lease-buyout': [
    [
      'Skip the end-of-lease penalties and just keep the car on financing that fits.',
      'Skip the end-of-lease penalties and keep the car with financing that fits.',
    ],
    [
      'Modify your car the way you want it, no GPS trackers, and no mileage limts',
      'Modify your car the way you want, with no GPS trackers and no mileage limits.',
    ],
    ['No Restrictions', 'No restrictions'],
    [" — it won't affect your credit score.", ". It won't affect your credit score."],
  ],
  hypercar: [
    ["lender list runs out — that's where we start", "lender list runs out, that's where we start"],
    ['collector demand — we appraise', 'collector demand. We appraise'],
    ['the asset and the owner — with no', 'the asset and the owner, with no'],
    ["cars we'll underwrite — the ones", "cars we'll underwrite, the ones"],
    ["what's possible — quickly, and without", "what's possible, quickly and without"],
  ],
  about: [
    ['who happen to do lending — not a bank', 'who happen to do lending, not a bank'],
    ['wanted to borrow from — one that', 'wanted to borrow from, one that'],
    ['park it in the garage — fast, private', 'park it in the garage. Fast, private'],
  ],
  'my-account': [['and statements — all in one place.', 'and statements, all in one place.']],
  vehicles: [
    ['A look at cars that we are ready to finance.', "A look at cars we're ready to finance."],
  ],
  dealers: [
    ['Partner With Us.', 'Partner with us.'],
    ["Don't Lose the Sale", "Don't lose the sale"],
    ['We Understand The Asset', 'We understand the asset'],
    [
      'With a robust portfolio from air cooled Porsches to Mclaren P1s, we are no stranger to your newest acquisition.',
      'From air-cooled Porsches to McLaren P1s, we understand the vehicles your buyers are looking for.',
    ],
    ['White-Glove Experience', 'White-glove experience'],
    ['White glove experience', 'White-glove experience'],
    ['knowledgable', 'knowledgeable', 2],
    ['Franchise Dealers', 'Franchise dealers'],
    ['Independent Dealers', 'Independent dealers'],
    ['Select Brokers', 'Select brokers'],
    [
      'Typically same day approvals up to 24 hours',
      'Typically, same-day approvals within 24 hours',
    ],
    ['submission is in — built to keep', 'submission is in. Built to keep'],
    ['hypercar inventory — the makes', 'hypercar inventory: the makes'],
    ['reachable directly — supporting you', 'reachable directly, supporting you'],
    ["The client is yours — we're the financing", "The client is yours. We're the financing"],
    ['ready to sign — because', 'ready to sign, because'],
  ],
  home: [
    ['Terms up to 240 months gets you', 'Terms up to 240 months get you'],
    ['fast funding, Turn bidders into buyers.', 'fast funding. Turn bidders into buyers.'],
    [
      'Typically same day approvals up to 24 hours',
      'Typically, same-day approvals within 24 hours',
      2,
    ],
    ['24–48h', '24h'],
    [" — it won't affect your credit score.", ". It won't affect your credit score."],
    ['for car people — the car you want', 'for car people. The car you want'],
    ['amortized terms — fast approvals', 'amortized terms, with fast approvals'],
    ['numbers-matching collector — we understand', 'numbers-matching collector, we understand'],
    ['know the market — not a paranoid bank', 'know the market, not a paranoid bank'],
    ['— Rizz client, ', 'Rizz client, ', 2],
    ['no prepayment penalty — so you can', 'no prepayment penalty, so you can'],
  ],
  eligibility: [
    ['cash out refinancing', 'cash-out refinance'],
    ['Amortized Terms', 'Amortized terms'],
    ["Here's what we look for — the full picture", "Here's what we look for. The full picture"],
  ],
  partners: [
    ['Become a partner dealer', 'Become a Rizz partner'],
    ['right there — ', 'right there: '],
  ],
  careers: [
    [
      'Fill this out and a rep will contact you shortly.',
      'Tell us a little about yourself and our team will be in touch.',
    ],
    ["treats buyers like people — let's talk.", "treats buyers like people, let's talk."],
    ["the builds — it's the job.", "the builds. It's the job."],
  ],
  contact: [['Get into contact with us', 'Get in touch with us']],
  'apply-now': [['Your New Lowest Payment', 'Your new lowest payment']],
  'check-availability': [['Check Availability', 'Check availability']],
}

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

function collectStrings(value, pathStr, out) {
  if (typeof value === 'string') {
    out.push({path: pathStr, original: value, value})
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => {
      const segment = item?._key ? `_key=="${item._key}"` : i
      collectStrings(item, `${pathStr}[${segment}]`, out)
    })
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (!key.startsWith('_')) collectStrings(child, `${pathStr}.${key}`, out)
    }
  }
}

const docs = await client.fetch(
  '*[_type == "page" && slug.current in $slugs]',
  {slugs: Object.keys(EDITS)},
  {perspective: 'raw'},
)

const transaction = client.transaction()
const problems = []

for (const [slug, edits] of Object.entries(EDITS)) {
  const matching = docs.filter((doc) => doc.slug?.current === slug)
  if (!matching.some((doc) => !doc._id.includes('.'))) problems.push(`${slug}: no published page found`)

  for (const doc of matching) {
    const strings = []
    collectStrings(doc.pageBuilder, 'pageBuilder', strings)

    for (const [from, to, expected = 1] of edits) {
      let hits = 0
      for (const entry of strings) {
        const count = entry.value.split(from).length - 1
        if (count) {
          entry.value = entry.value.replaceAll(from, to)
          hits += count
        }
      }
      if (hits !== expected) problems.push(`${doc._id} (${slug}): "${from}" found ${hits}×, expected ${expected}`)
    }

    const changed = strings.filter((entry) => entry.value !== entry.original)
    if (!changed.length) continue

    console.log(`\n${doc._id} (${slug})`)
    for (const entry of changed) {
      console.log(`  ${entry.path}\n    - ${entry.original}\n    + ${entry.value}`)
    }
    const set = Object.fromEntries(changed.map((entry) => [entry.path, entry.value]))
    transaction.patch(doc._id, (patch) => patch.set(set).ifRevisionId(doc._rev))
  }
}

if (problems.length) {
  console.error(`\nAborted, nothing written:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}

if (!COMMIT) {
  console.log('\nDry run. Re-run with --commit to write.')
} else {
  const result = await transaction.commit()
  console.log(`\nCommitted ${result.results.length} document(s).`)
}
