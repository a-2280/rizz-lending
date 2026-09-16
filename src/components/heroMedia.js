import Image from 'next/image';
import { sanityImage } from '@/lib/image';
import { resolveHeroVideo } from '@/lib/video-sources';

/**
 * The background media for a hero block: a local compressed video when the
 * Sanity upload has one mapped in src/lib/video-sources.js, otherwise the
 * fallback image. Never both.
 *
 * Rendering both was the previous behaviour — the image and video ternaries were
 * independent, and .bg-image absolutely positions both at inset 0 — so every
 * hero that had an image AND a video downloaded the full-resolution image only
 * to paint the video on top of it. Picking one is a straight bandwidth win.
 *
 * No hooks here, so this works unchanged inside the four 'use client' heroes and
 * the one server-rendered hero (imageHero).
 */
export default function HeroMedia({ image, video, sizes = '100vw', width = 1920, priority = false }) {
  const local = resolveHeroVideo(video?.asset?.url);

  if (local) {
    return (
      <video className="bg-image" poster={local.poster} preload="metadata" autoPlay muted loop playsInline>
        {local.webm && <source src={local.webm} type="video/webm" />}
        <source src={local.mp4} type="video/mp4" />
      </video>
    );
  }

  // No local mapping — fall back to the image rather than the Sanity video URL.
  // A video-only block with an unmapped upload renders nothing at all, which is
  // intentional: it must not fetch from cdn.sanity.io/files.
  const imageUrl = sanityImage(image, width);
  if (!imageUrl) return null;

  return <Image className="bg-image" src={imageUrl} alt="" fill sizes={sizes} priority={priority} />;
}

/**
 * Whether a hero has any background media to show, for the callers that wrap the
 * media in a positioned container and pair it with a scrim overlay.
 */
export function hasHeroMedia({ image, video }) {
  return Boolean(resolveHeroVideo(video?.asset?.url) || image?.asset?.url);
}
