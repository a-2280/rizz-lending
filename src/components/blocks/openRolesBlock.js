import Link from 'next/link';
import ApplyNow from '../applyNow';
import { resolveHref } from '@/lib/links';

export default function OpenRolesBlock({ eyebrow, heading, items, note, buttons }) {
  const hasItems = items?.length > 0;

  return (
    <section className='bg-silk text-ink-dim p30 py70 flex justify-center'>
      <div className='max-1400 flex w-100 flex-col gap-30'>
        {(eyebrow || heading) && (
          <div className='flex flex-col gap-10 fade--in' data-sal>
            {eyebrow && <span className='eyebrow'>{eyebrow}</span>}
            {heading && <h2 className='h2 text-carbon'>{heading}</h2>}
          </div>
        )}
        {hasItems ? (
          <div className='grid m-flex m-flex-col'>
            {items.map((item) => (
              <div className='card p30 radius-5 bg-white border-line-d flex flex-col gap-10 m-max-unset' key={item._key}>
                {item.heading && <p className='f-18 f-display text-midnight weight-700'>{item.heading}</p>}
                {item.description && <p className='f-14 text-ink-dim'>{item.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          note && <p className='fade--in' data-sal>{note}</p>
        )}
        {buttons?.length > 0 && (
          <div className='flex gap-10'>
            {buttons.map((btn) => (btn._type === 'applyButton' ? <ApplyNow key={btn._key} /> : <Link key={btn._key} className='button-1' href={resolveHref(btn)}>{btn.label}</Link>))}
          </div>
        )}
      </div>
    </section>
  );
}
