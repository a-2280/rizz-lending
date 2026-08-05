'use client';

import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

export default function ImageMarquee({ eyebrow, heading, images }) {
  const hasImages = images?.length > 0;
  const track = hasImages ? [...images, ...images] : [];

  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true, align: 'start' }, [AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true, startDelay: 0 })]);

  return (
    <section className='p40 py70 flex justify-center'>
      <div className="flex flex-col gap-30 max-1400 w-100">
        {(eyebrow || heading) && (
          <div className="flex flex-col gap-10 max-700 fade--in" data-sal style={{ textAlign: 'center', margin: '0 auto' }}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {heading && <h2 className="h2">{heading}</h2>}
          </div>
        )}
        {hasImages && (
          <div className="image-marquee pos-rel overflow" ref={emblaRef}>
            <div className="flex nowrap gap-15">
              {track.map((image, i) => (
                <div key={`${image._key}-${i}`} className="pos-rel ratio-16-10 max-400 w-100 shrink-0 radius-10 overflow" style={i === track.length - 1 ? { marginRight: 15 } : undefined}>
                  <Image className="bg-image" src={image.asset.url} alt="" fill />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
