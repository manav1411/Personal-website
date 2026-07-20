'use client';

// Minimal secondary nav: the main learning page, and an "Other" space for the
// reference material (patterns, python, toolkit) that isn't part of the core loop.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, FlaskConical } from 'lucide-react';

export default function LearnNav() {
  const pathname = usePathname();
  const onLearn = pathname === '/learn';

  const items = [
    { href: '/learn', label: 'Learn', icon: GraduationCap, active: onLearn },
    {
      href: '/learn/other',
      label: 'Other',
      icon: FlaskConical,
      active: pathname.startsWith('/learn') && !onLearn,
    },
  ];

  return (
    <nav className="flex items-center gap-2">
      {items.map(({ href, label, icon: Icon, active }) => (
        <Link
          key={href}
          href={href}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border ${
            active
              ? 'bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100'
              : 'text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700'
          }`}
        >
          <Icon size={15} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
