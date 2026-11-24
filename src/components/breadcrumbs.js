import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  if (!items?.length) return null;
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.href}>
              {current ? <span aria-current="page">{item.name}</span> : <Link href={item.href}>{item.name}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
