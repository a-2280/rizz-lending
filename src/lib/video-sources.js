/**
 * Hero video sources — served from /public, not from Sanity.
 *
 * WHY
 * Sanity `file` assets have no transform pipeline: no transcode, no resize, no
 * poster, no adaptive bitrate. Whatever an editor uploads is exactly what every
 * visitor downloads. Two hero uploads of 63MB and 53MB (plus two orphaned
 * earlier cuts of 94MB and 113MB) drove ~83% of the project's CDN egress and
 * nearly exhausted the 100GB/month free-plan bandwidth cap.
 *
 * So the heroes play compressed copies from /public instead. The Sanity `video`
 * field stays in the schema and in the GROQ queries untouched — editors keep the
 * field they know, and nothing has to be migrated — but the frontend resolves it
 * through this table rather than rendering the cdn.sanity.io URL.
 *
 * Keyed by the Sanity asset-URL basename (the asset ID), which is stable for the
 * life of the asset.
 *
 * IMPORTANT: a Sanity video with no entry here is deliberately NOT rendered —
 * the block falls back to its poster/fallback image. That is the whole safety
 * property: a fresh Studio upload cannot silently re-spike bandwidth. See the
 * matching `description` on the `video` field in the block schemas, which tells
 * editors that uploads here won't appear on the site yet.
 *
 * SWITCHING BACK LATER
 * - Back to Sanity: have resolveHeroVideo return `{ mp4: videoUrl }` for any
 *   unmapped URL instead of null. One line in this file; no component changes.
 * - To Mux / Cloudflare Stream / any CDN: replace the mp4/webm/poster strings
 *   below with the playback URLs. They are plain strings and are passed straight
 *   to <source src> / <video poster>, so nothing else has to change. (A true Mux
 *   integration would swap <video> for an HLS player in heroMedia.js.)
 *
 * Regenerate the files here with `scripts/compress-videos.sh`.
 *
 * Filenames carry a content hash (`home-hero.<sha256:8>.mp4`) because
 * netlify.toml serves /videos/* as `immutable` for a year. A replaced video
 * must get a new name — the script does this — or returning visitors keep the
 * old one. Paste the paths it prints into the table below.
 */

// `webm` is null by design: VP9 saved only ~14% per view but doubled the binary
// weight in git, and H.264 is universally supported. heroMedia.js still emits a
// <source> for it if a path is ever filled in, so re-enabling means regenerating
// with scripts/compress-videos.sh and setting the path here.

const HOME_HERO = {
  mp4: '/videos/home-hero.8d3e0c92.mp4', // 3.9MB (720p, CRF 32), down from 63.3MB
  webm: null,
  poster: '/videos/home-hero-poster.71544529.jpg',
};

const HYPERCAR_HERO = {
  mp4: '/videos/hypercar-hero.efc44e4c.mp4', // 3.5MB, down from 52.9MB
  webm: null,
  poster: '/videos/hypercar-hero-poster.bbba3e2a.jpg',
};

export const LOCAL_VIDEOS = {
  // Home → hero block 60801939ece4 (originally "RIZZ WEBSITE.mp4", 63.3MB)
  '1ff7f24730e35b04788392b5c29a7a9eddafcaec.mp4': HOME_HERO,
  // Hypercar → textHero block e6e9e9fce0fa (originally "RIZZ WEBSITEHYPERCAR.mp4", 52.9MB)
  'b87e5c84c92f0025dc3b703e1e77d9212c263f6d.mp4': HYPERCAR_HERO,
};

/**
 * Resolve a Sanity video asset URL to its local replacement.
 *
 * @param {string|undefined} videoUrl - e.g. video.asset.url from GROQ
 * @returns {{mp4: string, webm: string|null, poster: string}|null}
 *   null when there is no video, or when the upload has no local mapping.
 */
export function resolveHeroVideo(videoUrl) {
  if (!videoUrl) return null;
  const filename = videoUrl.split('/').pop();
  return LOCAL_VIDEOS[filename] || null;
}
