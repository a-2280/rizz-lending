import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ApplyNow from '../applyNow';
import { resolveHref } from '@/lib/links';

export default function IconCardsBlock({ eyebrow, heading, description, quote, theme = 'light', layout = 'grid', cards, buttons }) {
  const hasCards = cards?.length > 0;
  const isDark = theme === 'dark';
  const isSplit = layout === 'split';
  const cardsAreDark = isDark && !isSplit;

  const content = (eyebrow || heading || description) && (
    <div className="flex flex-col gap-15">
      <div className="flex flex-col gap-10 fade--in" data-sal>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {heading && <h2 className={`h2${isDark ? ' text-silk' : ' text-carbon'}`}>{heading}</h2>}
      </div>
      {description && <p className={`pre-line fade--in${isSplit ? '' : ' max-600'}`} data-sal>{description}</p>}
      {isSplit && buttons?.length > 0 && (
        <div className="flex gap-10">
          {buttons.map((btn) => (btn._type === 'applyButton' ? <ApplyNow key={btn._key} /> : <Link key={btn._key} className="button-2" href={resolveHref(btn)}>{btn.label}</Link>))}
        </div>
      )}
    </div>
  );

  const cardList = hasCards && (
    <div className={isSplit ? 'flex flex-col gap-20' : 'grid m-flex m-flex-col'}>
      {cards.map((card) => (
        <div className={`card p30 radius-5 flex flex-col gap-10 m-max-unset${isSplit ? '' : ' max-400'}${cardsAreDark ? ' bg-carbon border-line' : ' bg-white border-line-d'}`} key={card._key}>
          {card.marker && (card.marker === '→' ? <ArrowRight className="marker" size={24} strokeWidth={2.5} /> : <span className="marker">{card.marker}</span>)}
          {card.heading && <p className={`f-18 f-display weight-700${cardsAreDark ? ' text-silk' : ' text-midnight'}`}>{card.heading}</p>}
          {card.description && <p className={`f-14${cardsAreDark ? ' text-silk-dim' : ' text-ink-dim'}`}>{card.description}</p>}
        </div>
      ))}
    </div>
  );

  if (isSplit) {
    return (
      <section className={`icon-cards icon-cards--split p30 py70 flex justify-center${isDark ? '' : ' bg-silk text-ink-dim'}`}>
        <div className="flex align-center space-between m-flex-col max-1400 ma">
          <div className="flex-1">{content}</div>
          <div className="flex-1 pl50">{cardList}</div>
        </div>
      </section>
    );
  }

  return (
    <section className={`icon-cards p30 py70 flex justify-center${isDark ? '' : ' bg-silk text-ink-dim'}`}>
      <div className="flex flex-col gap-40">
        {content}
        {cardList}
        {quote && <p className={`f-20 f-serif italic max-600 fade--in${isDark ? ' text-silk' : ' text-midnight'}`} data-sal>{quote}</p>}
        {buttons?.length > 0 && (
          <div className="flex gap-10">
            {buttons.map((btn) => (btn._type === 'applyButton' ? <ApplyNow key={btn._key} /> : <Link key={btn._key} className="button-2" href={resolveHref(btn)}>{btn.label}</Link>))}
          </div>
        )}
      </div>
    </section>
  );
}
