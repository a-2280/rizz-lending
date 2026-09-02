'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import ApplyNow from '../applyNow';
import { resolveHref } from '@/lib/links';

const LOGO_HEIGHT = 80;
const LOGO_GAP = 50;

function GridPhoto({ item }) {
  return (
    <>
      <Image className="bg-image" src={item.photo.asset.url} alt={item.photoCaption || ''} fill />
      {item.photoCaption && (
        <>
          <div className="scrim-b" />
          <div className="absolute bottom-15 left-15 flex flex-col gap-5 f-14">
            <span className="text-silk weight-600">{item.photoCaption}</span>
          </div>
        </>
      )}
    </>
  );
}

export default function PhotoLogoBlock({ eyebrow, heading, description, items, logos, buttons }) {
  const photoItems = items?.filter((item) => item.photo?.asset) || [];
  const hasPhotos = photoItems.length > 0;

  const marques = logos?.filter((item) => item.logo?.asset?.url) || [];
  const repeats = marques.length ? Math.max(3, Math.ceil(24 / marques.length)) : 0;
  const track = Array.from({ length: repeats }, () => marques).flat();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true, align: 'start' }, [AutoScroll({ speed: 1, stopOnInteraction: true, stopOnMouseEnter: false, startDelay: 0 }), WheelGesturesPlugin()]);

  useEffect(() => {
    if (!emblaApi) return;
    let timer;
    const resume = () => (timer = setTimeout(() => emblaApi.plugins().autoScroll?.play(), 300));
    const cancel = () => clearTimeout(timer);
    emblaApi.on('pointerUp', resume).on('pointerDown', cancel);
    return () => {
      cancel();
      emblaApi.off('pointerUp', resume).off('pointerDown', cancel);
    };
  }, [emblaApi]);

  return (
    <section className="photo-logo-block bg-silk text-ink-dim py70 flex flex-col gap-30">
      {(eyebrow || heading || description) && (
        <div className="px30 flex flex-col gap-15 w-100 max-1400 ma">
          <div className="flex flex-col gap-10 fade--in" data-sal>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {heading && <h2 className="h2 text-carbon">{heading}</h2>}
          </div>
          {description && (
            <p className="fade--in" data-sal>
              {description}
            </p>
          )}
        </div>
      )}

      {hasPhotos && (
        <div className="px30 flex gap-15 m-flex-col w-100 max-1400 ma">
          {photoItems.map((item) => (
            <div className="pos-rel ratio-4-5 radius-10 overflow flex-1" key={item._key}>
              <GridPhoto item={item} />
            </div>
          ))}
        </div>
      )}

      {track.length > 0 && (
        <div className="logo-track pos-rel overflow" ref={emblaRef} data-lenis-prevent-horizontal>
          <div className="flex align-center nowrap gap-50">
            {track.map((item, i) => {
              const { width, height } = item.logo.asset.metadata?.dimensions || {};
              const ratio = width && height ? width / height : 2;
              return <Image className="shrink-0" key={`${item._key}-${i}`} src={item.logo.asset.url} alt={item.brand || ''} width={Math.round(LOGO_HEIGHT * ratio)} height={LOGO_HEIGHT} style={i === track.length - 1 ? { marginRight: LOGO_GAP } : undefined} />;
            })}
          </div>
        </div>
      )}

      {buttons?.length > 0 && (
        <div className="px30 flex gap-10 w-100 max-1400 ma">
          {buttons.map((btn) =>
            btn._type === 'applyButton' ? (
              <ApplyNow key={btn._key} />
            ) : (
              <Link className="button-3" key={btn._key} href={resolveHref(btn)}>
                {btn.label}
              </Link>
            ),
          )}
        </div>
      )}
    </section>
  );
}
