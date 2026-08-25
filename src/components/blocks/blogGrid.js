import Image from 'next/image';
import Link from 'next/link';
import { resolveHref } from '@/lib/links';

const PLACEHOLDER = { background: 'linear-gradient(135deg, var(--adventure), var(--flame))', opacity: 0.85 };

export default function BlogGrid({ eyebrow, heading, description, items }) {
  const hasItems = items?.length > 0;

  return (
    <section className="blog-grid bg-midnight text-silk-dim p30 py70 flex justify-center">
      <div className="pth flex flex-col gap-40 max-1400">
        {(eyebrow || heading || description) && (
          <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2 text-silk">{heading}</h2>}
            </div>
            {description && <p className="max-600 fade--in" data-sal>{description}</p>}
          </div>
        )}
        {hasItems && (
          <div className="grid">
            {items.map((item) => {
              const href = resolveHref(item.link);
              const Wrapper = href ? Link : 'div';
              const wrapperProps = href ? { href } : {};
              return (
                <Wrapper className="post radius-5 bg-white border-line-d overflow flex flex-col fade--in" data-sal key={item._key} {...wrapperProps}>
                  <div className="post-photo pos-rel ratio-22-9" style={item.photo?.asset ? undefined : PLACEHOLDER}>
                    {item.photo?.asset && <Image className="bg-image" src={item.photo.asset.url} alt="" fill />}
                  </div>
                  <div className="p20 flex flex-col gap-5">
                    {item.eyebrow && <span className="text-flame f-12 weight-700">{item.eyebrow}</span>}
                    {item.heading && <h3 className="h5 text-midnight">{item.heading}</h3>}
                    {item.description && <p className="f-14 text-ink-dim">{item.description}</p>}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
