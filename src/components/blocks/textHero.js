'use client';

import { useEffect, useRef } from 'react';
import AnchorLink from '../anchorLink';
import { PortableText } from 'next-sanity';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ApplyNow from '../applyNow';
import { Check } from 'lucide-react';
import { resolveHref } from '@/lib/links';

const headingComponents = {
  block: {
    normal: ({ children }) => children,
  },
  marks: {
    textColor: ({ children, value }) => <span style={{ color: `var(--${value.color})` }}>{children}</span>,
  },
};

const disclaimerComponents = {
  block: {
    normal: ({ children }) => children,
  },
  marks: {
    textColor: ({ children, value }) => <span style={{ color: `var(--${value.color})` }}>{children}</span>,
  },
};

export default function TextHero({ eyebrow, heading, subText, buttons, disclaimer, showIcon, image, video }) {
  const imageUrl = image?.asset?.url;
  const videoUrl = video?.asset?.url;
  const hasApplyButton = buttons?.some((btn) => btn._type === 'applyButton');
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);

  useEffect(() => {
    if (!mediaRef.current || !sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(mediaRef.current, {
        y: '15%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero text-only pos-rel pth bg-glow" ref={sectionRef}>
      <div className="background-media pos-rel">
        {(imageUrl || videoUrl) && (
          <div className="bg-image" style={{ top: '-15%', height: '115%' }} ref={mediaRef}>
            {imageUrl ? <Image className="bg-image" src={imageUrl} alt="" fill></Image> : ''}
            {videoUrl ? <video className="bg-image" src={videoUrl} autoPlay muted loop playsInline /> : ''}
          </div>
        )}
      </div>
      {(imageUrl || videoUrl) && <div className="hero-scrim" />}
      <div className="flex flex-col justify-center p30 py70 z-3 pos-rel gap-30 fade--in" data-sal>
        <div className="flex flex-col gap-20">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="h1">{heading && <PortableText value={heading} components={headingComponents} />}</h1>
          </div>
          {subText && <p className="max-500 text-balanced">{subText}</p>}
        </div>
        <div className="flex flex-col gap-20">
          {buttons?.length > 0 && (
            <div className="flex gap-10">
              {buttons.map((btn) => (btn._type === 'applyButton' ? <ApplyNow key={btn._key} /> : <AnchorLink key={btn._key} className={hasApplyButton ? 'button-2' : 'button-1'} href={resolveHref(btn)}>{btn.label}</AnchorLink>))}
            </div>
          )}
          {disclaimer && (
            <div className="f-14 flex gap-10 align-center">
              {showIcon && <Check size={14} strokeWidth={3} color="#7fc98a" />}
              <div className="max-300">
                <PortableText value={disclaimer} components={disclaimerComponents} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
