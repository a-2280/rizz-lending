import { PortableText } from 'next-sanity';
import { proseComponents } from '@/components/prose';

export default function RichTextBlock({ eyebrow, heading, body }) {
  if (!eyebrow && !heading && !body?.length) return null;
  return (
    <section className="p30 py70 text-silk-dim">
      <div className="flex justify-center max-1400 ma">
        <div className="flex flex-col gap-15 w-100">
          {(eyebrow || heading) && (
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2 text-silk">{heading}</h2>}
            </div>
          )}
          {body?.length > 0 && (
            <div className="prose-measure prose-rich fade--in" data-sal>
              <PortableText value={body} components={proseComponents} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
