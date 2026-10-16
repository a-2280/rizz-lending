import { PortableText } from 'next-sanity';
import HeroMedia, { hasHeroMedia } from '../heroMedia';

const headingComponents = {
  block: {
    normal: ({ children }) => children,
  },
  marks: {
    textColor: ({ children, value }) => <span style={{ color: `var(--${value.color})` }}>{children}</span>,
  },
};

export default function ImageHero({ eyebrow, eyebrowColor, heading, subText, image, video }) {
  const hasMedia = hasHeroMedia({ image, video });

  return (
    <section className='hero p30 pth bg-glow'>
      <div className="pos-rel pt70 flex flex-col gap-40 w-100 max-1400 ma">
        <div className="flex flex-col gap-20 z-3 pos-rel">
          <div className='flex flex-col gap-5'>
          {eyebrow && <p className={eyebrowColor === 'light' ? 'eyebrow eyebrow-light' : 'eyebrow eyebrow-orange'}>{eyebrow}</p>}
          <h1 className="h1">{heading && <PortableText value={heading} components={headingComponents} />}</h1></div>
          {subText && <p className="f-18 text-silk-dim max-500 text-balanced">{subText}</p>}
        </div>
        {hasMedia && (
          <div className="pos-rel ratio-22-9 radius-10 overflow fade--in" data-sal>
            {/* Boxed, max-1400 inside p30 gutters — never wider than 1340 CSS px. */}
            <HeroMedia image={image} video={video} width={1600} sizes="(max-width: 1400px) 100vw, 1400px" />
          </div>
        )}
      </div>
    </section>
  );
}
