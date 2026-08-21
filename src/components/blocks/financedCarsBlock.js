'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import ApplyNow from '../applyNow';
import { resolveHref } from '@/lib/links';

import 'swiper/css';
import 'swiper/css/effect-fade';

function CarPhoto({ item }) {
  return (
    <>
      <Image className="bg-image" src={item.photo.asset.url} alt={item.photoCaption || ''} fill />
      {(item.photoCaption || item.photoSubcaption) && (
        <>
          <div className="scrim-b" />
          <div className="absolute bottom-15 left-15 flex flex-col gap-5 f-14">
            {item.photoCaption && <span className="text-silk weight-600">{item.photoCaption}</span>}
            {item.photoSubcaption && <small className="text-silk-dim">{item.photoSubcaption}</small>}
          </div>
        </>
      )}
    </>
  );
}

export default function FinancedCarsBlock({ eyebrow, heading, description, items, note, buttons }) {
  const photoItems = items?.filter((item) => item.photo?.asset) || [];
  const hasItems = photoItems.length > 0;

  return (
    <section className="bg-silk text-ink-dim p30 py70">
      <div className="flex flex-col gap-40 max-1400 ma">
        {(eyebrow || heading || description) && (
          <div className="flex flex-col gap-15">
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
        <div className='flex flex-col gap-30'>
        {hasItems && (
          <div className="flex gap-15">
            {photoItems.length > 3
              ? [0, 1, 2].map((slot) => (
                  <div className="pos-rel ratio-4-3 radius-10 overflow flex-1 financed-cars-slot" key={slot}>
                    <Swiper modules={[EffectFade, Autoplay]} effect="fade" speed={650} loop allowTouchMove={false} initialSlide={slot} autoplay={{ delay: 5000, disableOnInteraction: false }}>
                      {photoItems.map((item) => (
                        <SwiperSlide key={item._key}>
                          <CarPhoto item={item} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ))
              : photoItems.map((item) => (
                  <div className="pos-rel ratio-4-3 radius-10 overflow flex-1" key={item._key}>
                    <CarPhoto item={item} />
                  </div>
                ))}
          </div>
        )}
        {note && <p className='italic f-18 f-serif max-500 fade--in' data-sal>{note}</p>}
        {buttons?.length > 0 && (
          <div className='flex gap-10'>
            {buttons.map((btn) =>
              btn._type === 'applyButton' ? (
                <ApplyNow key={btn._key} />
              ) : (
                <Link className='button-3' key={btn._key} href={resolveHref(btn)}>
                  {btn.label}
                </Link>
              ),
            )}
          </div>
        )}</div>
      </div>
    </section>
  );
}
