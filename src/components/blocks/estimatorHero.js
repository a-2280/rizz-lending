'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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

function monthlyPayment(principal, months, apr) {
  const i = apr / 12;
  return (principal * i) / (1 - Math.pow(1 + i, -months));
}

const usd = new Intl.NumberFormat('en-US');
const fmtUSD = (n) => '$' + usd.format(Math.round(n));

export default function EstimatorHero({ eyebrow, heading, subText, buttons, disclaimer, showIcon, image, video, calcEyebrow, calcHeading, minFinanced, maxFinanced, apr, terms, calcDisclaimer }) {
  const imageUrl = image?.asset?.url;
  const videoUrl = video?.asset?.url;
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

  const STEP = 5000;
  const [financed, setFinanced] = useState(() => {
    const raw = minFinanced + 0.25 * (maxFinanced - minFinanced);
    return Math.round(raw / STEP) * STEP;
  });
  const [months, setMonths] = useState(terms?.[0]?.months);

  const monthly = months ? monthlyPayment(financed, months, apr / 100) : 0;

  return (
    <section className="hero estimator pos-rel pth bg-glow" ref={sectionRef}>
      <div className="background-media pos-rel">
        {(imageUrl || videoUrl) && (
          <div className="bg-image" style={{ top: '-15%', height: '115%' }} ref={mediaRef}>
            {imageUrl ? <Image className="bg-image" src={imageUrl} alt="" fill></Image> : ''}
            {videoUrl ? <video className="bg-image" src={videoUrl} autoPlay muted loop playsInline /> : ''}
          </div>
        )}
      </div>
      {(imageUrl || videoUrl) && <div className="hero-scrim" />}
      <div className="flex p30 py70 gap-50 z-3 pos-rel fade--in" data-sal>
        <Content eyebrow={eyebrow} heading={heading} subText={subText} buttons={buttons} disclaimer={disclaimer} showIcon={showIcon} />
        <div className='flex-1 flex justify-center'>
        <Calculator calcEyebrow={calcEyebrow} calcHeading={calcHeading} minFinanced={minFinanced} maxFinanced={maxFinanced} financed={financed} setFinanced={setFinanced} terms={terms} months={months} setMonths={setMonths} monthly={monthly} calcDisclaimer={calcDisclaimer} /></div>
      </div>
    </section>
  );
}

function Content({ eyebrow, heading, subText, buttons, disclaimer, showIcon }) {
  return (
    <div className="flex flex-col gap-40 max-700">
      <div className="flex flex-col gap-15">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="h1">{heading && <PortableText value={heading} components={headingComponents} />}</h1>
        </div>
        {subText && <p className="max-500 text-balanced">{subText}</p>}
      </div>
      <div className="flex flex-col gap-20">
        {buttons?.length > 0 && (
          <div className="flex gap-10">
            {buttons.map((btn) => (btn._type === 'applyButton' ? <ApplyNow key={btn._key} /> : <Link key={btn._key} className="button-2" href={resolveHref(btn)}>{btn.label}</Link>))}
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
  );
}

function Calculator({ calcEyebrow, calcHeading, minFinanced, maxFinanced, financed, setFinanced, terms, months, setMonths, monthly, calcDisclaimer }) {
  return (
    <div className="p30 bg-silk radius-5 flex flex-col gap-20 max-600">
      <div>
        {calcEyebrow && <div className="eyebrow">{calcEyebrow}</div>}
        {calcHeading && <h3 className="h5 text-midnight">{calcHeading}</h3>}
      </div>
      <div className="flex flex-col gap-15">
        <div className="flex flex-col gap-5">
          <label className="flex space-between" htmlFor="estimator-hero-amount">
            <p className="f-12 text-ink-dim uppercase weight-600">Amount Financed</p>
            <p className="text-flame f-14 weight-900">{fmtUSD(financed)}</p>
          </label>
          <input id="estimator-hero-amount" type="range" min={minFinanced} max={maxFinanced} step="5000" value={financed} onChange={(e) => setFinanced(Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-10">
          <label className="f-12 text-ink-dim uppercase weight-600">Term</label>
          <div className="flex space-between gap-5">
            {terms?.map((term) => (
              <button key={term.months} type="button" className={`term-button ${term.months === months ? 'on' : ''}`} onClick={() => setMonths(term.months)}>
                {term.months} mo
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-15">
        <div className="p20 bg-midnight flex space-between align-center radius-5">
          <div className="flex flex-col gap-10">
            <div className="f-12 text-silk-dim uppercase weight-600">Estimated Monthly</div>
            <div className="flex align-baseline gap-10">
              <p className="h3">{fmtUSD(monthly)}</p>
              <p className="text-silk-dim f-14 weight-500">/mo</p>
            </div>
          </div>
          <ApplyNow />
        </div>
        {calcDisclaimer && <p className="disclaimer">{calcDisclaimer}</p>}
      </div>
    </div>
  );
}
