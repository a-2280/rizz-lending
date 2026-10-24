import Image from 'next/image';
import Link from 'next/link';
import { sanityImage } from '@/lib/image';
import { getBlogPosts } from '@/lib/sanity';

const PLACEHOLDER = { background: 'var(--flame-bright)', opacity: 0.85 };

export default async function BlogGrid({ eyebrow, heading, description }) {
  const posts = await getBlogPosts();
  const hasItems = posts?.length > 0;

  return (
    <section className="blog-grid bg-midnight text-silk-dim p30 py70 flex justify-center">
      <div className="pth flex flex-col gap-40 max-1400">
        {(eyebrow || heading || description) && (
          <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h1 className="h2 text-silk">{heading}</h1>}
            </div>
            {description && <p className="max-600 fade--in" data-sal>{description}</p>}
          </div>
        )}
        {hasItems && (
          <div className="grid">
            {posts.map((post) => (
              <Link className="post radius-5 bg-white border-line-d overflow flex flex-col fade--in" data-sal key={post.slug} href={`/blog/${post.slug}`}>
                <div className="post-photo pos-rel ratio-22-9" style={post.mainImage?.asset ? undefined : PLACEHOLDER}>
                  {/* 3-col grid inside max-1400 with p30 gutters — about 433 CSS px each. */}
                  {post.mainImage?.asset && <Image className="bg-image" src={sanityImage(post.mainImage, 900)} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" />}
                </div>
                <div className="p20 flex flex-col gap-5">
                  {post.category && post.category !== 'Uncategorized' && <span className="text-flame f-12 weight-700">{post.category}</span>}
                  {post.title && <h3 className="h5 text-midnight">{post.title}</h3>}
                  {post.excerpt && <p className="f-14 text-ink-dim">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
