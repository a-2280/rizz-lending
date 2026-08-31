'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

export default function ImageMarquee({ eyebrow, heading, images }) {
  const hasImages = images?.length > 0;
  const track = hasImages ? [...images, ...images, ...images] : [];

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
    <section className='py70 flex justify-center'>
      <div className="flex flex-col gap-30 w-100">
        {(eyebrow || heading) && (
          <div className="flex flex-col gap-10 max-700 fade--in" data-sal style={{ textAlign: 'center', margin: '0 auto' }}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {heading && <h2 className="h2">{heading}</h2>}
          </div>
        )}
        {hasImages && (
          <div className="pos-rel overflow" ref={emblaRef} data-lenis-prevent-horizontal>
            <div className="flex nowrap gap-15">
              {track.map((image, i) => (
                <div key={`${image._key}-${i}`} className="pos-rel ratio-16-10 max-400 w-100 shrink-0 radius-10 overflow" style={i === track.length - 1 ? { marginRight: 15 } : undefined}>
                  <Image className="bg-image" src={image.asset.url} alt="" fill sizes="(max-width: 400px) 100vw, 400px" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
