import Image from 'next/image';
import { PortableText } from 'next-sanity';

const bodyComponents = {
  block: {
    h2: ({ children }) => <h2 className="h2">{children}</h2>,
    h3: ({ children }) => <h3 className="h3">{children}</h3>,
    h4: ({ children }) => <h4 className="h5">{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ children, value }) => {
      const isExternal = value?.href?.startsWith('http');
      return (
        <a href={value?.href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) =>
      value?.asset?.url ? (
        <span className="blog-post-image pos-rel ratio-16-10 radius-5 overflow">
          <Image src={value.asset.url} alt={value.alt || ''} fill className="bg-image" />
        </span>
      ) : null,
  },
};

function formatDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPost({ title, excerpt, mainImage, category, author, publishedAt, body }) {
  const date = formatDate(publishedAt);
  const imageUrl = mainImage?.asset?.url;

  return (
    <article className="blog-post bg-midnight text-silk pth">
      <div className="p30 py70 flex justify-center">
        <div className="flex flex-col gap-15 max-800 fade--in" data-sal>
          {category && category !== 'Uncategorized' && <span className="text-flame f-12 weight-700">{category.toUpperCase()}</span>}
          <h1 className="h1">{title}</h1>
          {excerpt && <p className="text-silk-dim">{excerpt}</p>}
          {(author || date) && (
            <p className="f-14 text-silk-dim">
              {author}
              {author && date ? ' · ' : ''}
              {date}
            </p>
          )}
        </div>
      </div>
      {imageUrl && (
        <div className="flex justify-center p30">
          <div className="blog-post-hero pos-rel ratio-16-10 radius-5 overflow max-1400 fade--in" data-sal>
            <Image src={imageUrl} alt="" fill className="bg-image" />
          </div>
        </div>
      )}
      <div className="p30 py70 flex justify-center">
        <div className="blog-post-body max-800 flex flex-col gap-20">
          <PortableText value={body} components={bodyComponents} />
        </div>
      </div>
    </article>
  );
}
