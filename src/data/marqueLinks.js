import { resolveHref } from '@/lib/links';

// Code-side map for the two marque rows. Homepage logos are a different block
// and are not listed here. An optional `link` on the marque wins when set.
const VEHICLES_BLOCK = 'e7157e01461f';
const HYPERCAR_BLOCK = '5ef381b8f098';

const BRANDS = {
  ferrari: { href: '/ferrari-financing', label: 'Ferrari financing' },
  lamborghini: { href: '/lamborghini-financing', label: 'Lamborghini financing' },
  porsche: { href: '/porsche-financing', label: 'Porsche financing' },
  mclaren: { href: '/mclaren-financing', label: 'McLaren financing' },
  bentley: { href: '/bentley-financing', label: 'Bentley financing' },
  'aston martin': { href: '/aston-martin-financing', label: 'Aston Martin financing' },
};

const TO_HYPERCAR = {
  bugatti: { href: '/hypercar', label: 'Hypercar financing' },
  pagani: { href: '/hypercar', label: 'Hypercar financing' },
  koenigsegg: { href: '/hypercar', label: 'Hypercar financing' },
};

// Asset hashes for hypercar logos stored without a brand name. Pagani and
// Koenigsegg on /hypercar are intentionally absent.
const ASSET = {
  '82d6ebac639fafb70c0ffbe95ff3d47fb75ddce4': BRANDS.ferrari,
  ed05d49feacb20775fd1325a1c96b2abf4b9bdee: BRANDS.mclaren,
  '72c2d8351fd3197ec5d6289d5f0f884c4e95e548': BRANDS['aston martin'],
  '4e2faf0af12af8abfb3f5fb1878dd034ee2a5de6': BRANDS.porsche,
};

const HYPERCAR_BRANDS = new Set(['porsche', 'ferrari', 'mclaren', 'aston martin']);

const LABEL_BY_HREF = Object.fromEntries([...Object.values(BRANDS), ...Object.values(TO_HYPERCAR)].map((item) => [item.href, item.label]));

function assetHash(id) {
  return id?.match(/^image-([a-f0-9]+)-/i)?.[1] || '';
}

function authoredLabel(item, href) {
  const label = item.link?.label?.trim();
  if (label) return label;
  if (LABEL_BY_HREF[href]) return LABEL_BY_HREF[href];
  if (item.brand) return `${item.brand} financing`;
  return 'Financing';
}

export function marqueDestination(blockKey, item) {
  const authored = resolveHref(item?.link);
  if (authored) return { href: authored, label: authoredLabel(item, authored) };

  const brand = item?.brand?.trim().toLowerCase().replace(/\s+/g, ' ');
  const hash = assetHash(item?.logo?.asset?._id);

  if (blockKey === VEHICLES_BLOCK) {
    return (brand && (BRANDS[brand] || TO_HYPERCAR[brand])) || ASSET[hash] || null;
  }

  if (blockKey === HYPERCAR_BLOCK) {
    if (brand && !HYPERCAR_BRANDS.has(brand)) return null;
    if (brand && BRANDS[brand]) return BRANDS[brand];
    return ASSET[hash] || null;
  }

  return null;
}
