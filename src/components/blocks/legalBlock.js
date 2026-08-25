import { PortableText } from 'next-sanity';

const legalComponents = {
  marks: {
    policyLink: ({ children, value }) => <a href={value?.href || '#'}>{children}</a>,
  },
};

export default function LegalBlock({ eyebrow, heading, items }) {
  const hasItems = items?.length > 0;

  return (
    <section className="bg-midnight pth p30 py70 flex justify-center">
      <div className="pth max-700 flex flex-col gap-30 fade--in" data-sal>
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {heading && <h1 className="h1">{heading}</h1>}
        </div>
        {hasItems && (
          <div className="flex flex-col gap-25">
            {items.map((item) => (
              <div className="flex flex-col gap-5" key={item._key}>
                {item.heading && <h2 className="h5">{item.heading}</h2>}
                {item.description && (
                  <div className="legal-prose text-silk-dim">
                    <PortableText value={item.description} components={legalComponents} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
