'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import ApplyNow from '../applyNow';
import { resolveHref } from '@/lib/links';
import { STATE_D } from '@/data/state-paths';
import { STATUS_LABEL } from '@/data/states';

const STATUS_ORDER = ['available', 'soon', 'unavailable'];

export default function AvailabilityMapBlock({ eyebrow, heading, description, buttons, states }) {
  const mapRef = useRef(null);
  const [hover, setHover] = useState(null);

  const statusByAbbr = {};
  (states || []).forEach((state) => {
    statusByAbbr[state.abbr] = state;
  });

  function positionFromEvent(e) {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleEnter(abbr, name) {
    return (e) => {
      const entry = statusByAbbr[abbr];
      setHover({ abbr, name, status: entry?.status || 'unavailable', note: entry?.note, ...positionFromEvent(e) });
    };
  }

  function handleLeave(abbr) {
    return () => {
      setHover((prev) => (prev?.abbr === abbr ? null : prev));
    };
  }

  function handleMove(e) {
    setHover((prev) => (prev ? { ...prev, ...positionFromEvent(e) } : prev));
  }

  return (
    <section className="availability-map bg-midnight text-silk p30 py70 flex justify-center">
      <div className="flex flex-col gap-40 max-1400 w-100 pth">
        {(eyebrow || heading || description) && (
          <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2 text-silk">{heading}</h2>}
            </div>
            {description && <p className="max-600 text-silk-dim fade--in" data-sal>{description}</p>}
          </div>
        )}

        <div className="flex gap-20 f-14 m-flex-col">
          {STATUS_ORDER.map((status) => (
            <div className="flex align-center gap-10" key={status}>
              <span className={`availability-map__swatch availability-map__swatch--${status}`} />
              <span>{STATUS_LABEL[status]}</span>
            </div>
          ))}
        </div>

        <div className="availability-map__wrap" ref={mapRef} onMouseLeave={() => setHover(null)}>
          <svg className="availability-map__svg" viewBox="0 0 960 610" onMouseMove={handleMove}>
            {Object.entries(STATE_D).map(([abbr, { name, d }]) => {
              const status = statusByAbbr[abbr]?.status || 'unavailable';
              return (
                <path
                  key={abbr}
                  d={d}
                  className={`availability-map__state availability-map__state--${status}`}
                  onMouseEnter={handleEnter(abbr, name)}
                  onMouseLeave={handleLeave(abbr)}
                  onFocus={handleEnter(abbr, name)}
                  onBlur={handleLeave(abbr)}
                  tabIndex={0}
                  aria-label={`${name}: ${STATUS_LABEL[status]}`}
                />
              );
            })}
            {Object.entries(STATE_D).map(([abbr, { d }]) => {
              const status = statusByAbbr[abbr]?.status || 'unavailable';
              if (status !== 'soon') return null;
              return <path key={`${abbr}-outline`} d={d} className="availability-map__state-outline" aria-hidden="true" pointerEvents="none" />;
            })}
          </svg>
          {hover && (
            <div className="availability-map__tooltip" style={{ left: hover.x, top: hover.y }}>
              <p className="f-14 weight-700">{hover.name}</p>
              <p className="f-12 text-silk-dim">{STATUS_LABEL[hover.status]}</p>
              {hover.note && <p className="f-12 text-silk-dim">{hover.note}</p>}
            </div>
          )}
        </div>

        {buttons?.length > 0 && (
          <div className="flex gap-10">
            {buttons.map((btn) => (btn._type === 'applyButton' ? <ApplyNow key={btn._key} /> : <Link key={btn._key} className="button-1" href={resolveHref(btn)}>{btn.label}</Link>))}
          </div>
        )}
      </div>
    </section>
  );
}
