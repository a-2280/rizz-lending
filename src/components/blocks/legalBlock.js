import { PortableText } from 'next-sanity';

function DefinitionTable({ value }) {
  const rows = value?.rows?.filter((row) => row?.term || row?.definition);
  if (!rows?.length) return null;

  return (
    <div className="flex flex-col gap-15">
      {value.caption && <p className="f-18 f-display weight-600 text-silk">{value.caption}</p>}
      <dl className="flex flex-col">
        {rows.map((row) => (
          <div className="flex flex-col gap-5 py20 line-static" key={row._key}>
            <dt className="f-display weight-600 text-silk">{row.term}</dt>
            <dd>{row.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const legalComponents = {
  block: {
    h3: ({ children }) => <h3 className="f-18 f-display weight-600 text-silk">{children}</h3>,
  },
  list: {
    bullet: ({ children, value }) => (
      <ul className={`flex flex-col gap-10 pl20 ${value?.level > 1 ? 'list-circle' : 'list-disc'}`}>{children}</ul>
    ),
    number: ({ children }) => <ol className="flex flex-col gap-10 pl20 list-decimal">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-silk weight-600">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    policyLink: ({ children, value }) => {
      const href = value?.href || '#';
      return (
        <a className="underline break-anywhere" href={href}>
          {children}
        </a>
      );
    },
  },
  types: {
    definitionTable: DefinitionTable,
  },
};

export default function LegalBlock({ eyebrow, heading, lastUpdated, items }) {
  const hasItems = items?.length > 0;

  return (
    <section className="bg-midnight pth p30 py70 flex justify-center">
      <div className="pth max-700 flex flex-col gap-30">
        <div className="flex flex-col gap-10 fade--in" data-sal>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {heading && <h1 className="h1">{heading}</h1>}
          {lastUpdated && <p className="f-14 text-silk-dim">Last modified: {lastUpdated}</p>}
        </div>
        {hasItems && (
          <div className="flex flex-col gap-25">
            {items.map((item) => (
              <div className="flex flex-col gap-5" key={item._key}>
                {item.heading && <h2 className="h5">{item.heading}</h2>}
                {item.description && (
                  <div className="flex flex-col gap-15 text-silk-dim">
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
