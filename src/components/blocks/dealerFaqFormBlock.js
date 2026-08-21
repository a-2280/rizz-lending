'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';

export default function DealerFaqFormBlock({ eyebrow, heading, description, items, formHeading, formSubtext, submitLabel }) {
  const [openKeys, setOpenKeys] = useState(() => new Set());
  const hasItems = items?.length > 0;
  const answerRefs = useRef(new Map());
  const iconRefs = useRef(new Map());

  function toggle(key) {
    const isOpen = openKeys.has(key);
    const answerEl = answerRefs.current.get(key);
    const iconEl = iconRefs.current.get(key);

    gsap.to(answerEl, { height: isOpen ? 0 : answerEl.scrollHeight, opacity: isOpen ? 0 : 1, duration: 0.3, ease: 'power2.inOut' });
    gsap.to(iconEl, { rotate: isOpen ? 0 : 45, duration: 0.3, ease: 'power2.inOut' });

    setOpenKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <section className="dealer-faq-form bg-silk text-ink-dim p30 py70 flex justify-center">
      <div className="flex gap-40 max-1400 m-flex-col">
        <div className="flex-1 flex flex-col gap-30">
          {(eyebrow || heading || description) && (
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2 text-carbon">{heading}</h2>}
              {description && <p>{description}</p>}
            </div>
          )}
          {hasItems && (
            <div>
              <div className="line-static-d" />
              {items.map((item) => {
                const isOpen = openKeys.has(item._key);
                return (
                  <div className={`line-static-d ${isOpen ? 'open' : ''}`} key={item._key}>
                    <button type="button" className="py20 w-100 f-20 weight-600 text-carbon flex align-center space-between gap-20" onClick={() => toggle(item._key)}>
                      <span className="f-display fade--in" data-sal>
                        {item.question}
                      </span>
                      <span
                        className="text-flame f-25"
                        ref={(el) => {
                          if (el) iconRefs.current.set(item._key, el);
                        }}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className="overflow h-0 op-0"
                      ref={(el) => {
                        if (el) answerRefs.current.set(item._key, el);
                      }}
                    >
                      <p className="pb20">{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="radius-10 bg-shadow p30 flex flex-col gap-20">
            <div className="flex flex-col gap-5">
              {formHeading && <h3 className="h5 text-midnight">{formHeading}</h3>}
              {formSubtext && <p className="f-14">{formSubtext}</p>}
            </div>
            <div className='flex flex-col gap-20'>
              <div className="flex gap-15 m-flex-col">
                <div className="flex-1 flex flex-col gap-5">
                  <label className="form-label">Dealership name</label>
                  <input className="form-input" type="text" placeholder="Rizz Motorsports" />
                </div>
                <div className="flex-1 flex flex-col gap-5">
                  <label className="form-label">Your name</label>
                  <input className="form-input" type="text" placeholder="First & last" />
                </div>
              </div>
              <div className="flex gap-15 m-flex-col">
                <div className="flex-1 flex flex-col gap-5">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="you@dealership.com" />
                </div>
                <div className="flex-1 flex flex-col gap-5">
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="text" placeholder="(555) 000-0000" />
                </div>
              </div>
              <div className="flex gap-15 m-flex-col">
                <div className="flex-1 flex flex-col gap-5">
                  <label className="form-label">Dealership type</label>
                  <select className="form-input">
                    <option>Franchise exotic / luxury</option>
                    <option>Independent specialist</option>
                    <option>Pre-owned / consignment</option>
                    <option>Classic / collector</option>
                    <option>Marketplace / auction</option>
                    <option>Broker / finder</option>
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-5">
                  <label className="form-label">Monthly exotic volume</label>
                  <select className="form-input">
                    <option>1–5 units</option>
                    <option>6–15 units</option>
                    <option>16–40 units</option>
                    <option>40+ units</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-10">
                <label className="form-label">Anything else?</label>
                <textarea className="form-input" placeholder="Inventory mix, current lender pain points, etc." />
              </div>
              <button type="button" className="button-1 w-100 text-center justify-center flex">
                {submitLabel || 'Submit inquiry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
