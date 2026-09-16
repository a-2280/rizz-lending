// Named export, not the default — the default export is deprecated in v2.
import { createImageUrlBuilder } from '@sanity/image-url';
// Deliberately NOT importing the client from './sanity': that module calls
// createClient() at module scope, and this helper is used from 'use client'
// components, which would drag @sanity/client into the browser bundle. The
// builder only needs the project coordinates.
import { projectId, dataset } from './sanity-config';

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build a sized, auto-formatted Sanity image URL.
 *
 * Sanity serves image originals when you ask for `asset->{url}` — this dataset's
 * run up to 25MB / 7728x5152 — and those originals were a large share of the CDN
 * egress that nearly exhausted the project's 100GB/month bandwidth cap. Every
 * render site should request a derivative sized to its layout instead.
 *
 * On Netlify this matters twice over: next/image proxies through Netlify's image
 * CDN, which fetches whatever `src` points at. Passing a sized URL means that
 * upstream fetch is ~100-300KB rather than the full original.
 *
 * Works directly on the `image{ asset->{ url } }` shape the GROQ queries already
 * return — @sanity/image-url reconstructs the asset ref from the URL filename
 * (its `isAssetStub` branch), so src/lib/sanity.js needs no projection changes.
 *
 * @param {object} source - a Sanity image object, e.g. `{ asset: { url } }`
 * @param {number} width - target width in px; pass ~2x the CSS width for retina
 * @param {{quality?: number}} [options]
 * @returns {string|null} sized URL, or null when there is no image
 */
export function sanityImage(source, width, { quality = 75 } = {}) {
  const url = source?.asset?.url;
  if (!url) return null;
  try {
    // fit('max') never upscales, so small originals are left alone.
    return builder.image(source).width(width).fit('max').auto('format').quality(quality).url();
  } catch {
    // parseAssetId throws on any URL it can't decompose (a non-Sanity host, a
    // filename without dimensions). Fall back to the original rather than
    // breaking the render.
    return url;
  }
}
