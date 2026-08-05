'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';

export default function FaqBlock({ eyebrow, heading, items }) {
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
    <section className="p30 py70 flex flex-col gap-30 align-center">
      {(eyebrow || heading) && (
        <div className="flex flex-col gap-10 align-center fade--in" data-sal>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {heading && <h2 className="h2 text-silk">{heading}</h2>}
        </div>
      )}
      {hasItems && (
        <div className="max-800">
          <div className='line-static' />
          {items.map((item) => {
            const isOpen = openKeys.has(item._key);
            return (
              <div className={`line-static ${isOpen ? 'open' : ''}`} key={item._key}>
                <button type="button" className="py20 w-100 f-20 weight-600 flex align-center space-between gap-20" onClick={() => toggle(item._key)}>
                  <span className='fade--in' data-sal>{item.question}</span>
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
                  className="text-silk-dim overflow h-0 op-0"
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
    </section>
  );
}
