import Link from 'next/link';
import { Check } from 'lucide-react';
import ApplyNow from '../applyNow';
import { resolveHref } from '@/lib/links';

export default function ChecklistBlock({ items, buttons }) {
  const hasItems = items?.length > 0;

  return (
    <section className='bg-silk text-ink-dim p30 py70 flex justify-center'>
      <div className='max-1400 flex flex-col gap-30'>
        {hasItems && (
          <div className='grid-2'>
            {items.map((item) => (
              <div className='p20 bg-white border-line-d radius-10 flex gap-15' key={item._key}>
                <div className='checklist-icon'>
                  <Check size={16} strokeWidth={3} />
                </div>
                <div className='flex flex-col gap-5'>
                  {item.heading && <p className='f-display text-midnight weight-700'>{item.heading}</p>}
                  {item.description && <p>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
        {buttons?.length > 0 && (
          <div className="flex gap-10">
            {buttons.map((btn) => (btn._type === 'applyButton' ? <ApplyNow key={btn._key} /> : <Link key={btn._key} className="button-3" href={resolveHref(btn)}>{btn.label}</Link>))}
          </div>
        )}
      </div>
    </section>
  );
}
