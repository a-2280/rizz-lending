'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

const LOGO_HEIGHT = 80;
const LOGO_GAP = 50;

export default function LogoGridBlock({ eyebrow, heading, description, logos }) {
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
    <section className="logo-grid py70 flex flex-col gap-50">
      {(eyebrow || heading || description) && (
        <div className="px30 flex flex-col align-center gap-15 max-1400 ma">
          <div className="flex flex-col align-center gap-10 fade--in" data-sal>
            {eyebrow && <span className="eyebrow text-center">{eyebrow}</span>}
            {heading && <h2 className="h2 text-center">{heading}</h2>}
          </div>
          {description && (
            <p className="text-silk-dim text-center fade--in" data-sal>
              {description}
            </p>
          )}
        </div>
      )}
      {track.length > 0 && (
        <div className="pos-rel overflow" ref={emblaRef} data-lenis-prevent-horizontal>
          <div className="flex align-center nowrap gap-50">
            {track.map((item, i) => {
              const { width, height } = item.logo.asset.metadata?.dimensions || {};
              const ratio = width && height ? width / height : 2;
              return <Image className="shrink-0 grayscale-invert" key={`${item._key}-${i}`} src={item.logo.asset.url} alt={item.brand || ''} width={Math.round(LOGO_HEIGHT * ratio)} height={LOGO_HEIGHT} style={i === track.length - 1 ? { marginRight: LOGO_GAP } : undefined} />;
            })}
          </div>
        </div>
      )}
    </section>
  );
}
