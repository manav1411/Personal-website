"use client";
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FileText, FolderGit2, GraduationCap, BookOpen, Sun, Moon } from 'lucide-react';

const NAV_LINKS = [
  { href: '/resume', label: 'Resume', icon: FileText },
  { href: '/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/university', label: 'University', icon: GraduationCap },
  { href: '/learn', label: 'Learn', icon: BookOpen },
] as const;

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 p-3 sm:p-4 border-b border-neutral-400 dark:border-neutral-700 bg-zinc-200 dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          className="text-lg sm:text-2xl font-bold relative inline-block shrink-0 hover:text-blue-500 dark:hover:text-blue-400"
        >
          Manav Dodia
          <span className="absolute left-0 bottom-0 block w-full h-1 bg-blue-500 dark:bg-blue-400 transition-transform transform scale-x-0 hover:scale-x-100"></span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  aria-label={label}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-sm border rounded-md ${
                    active
                      ? 'bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100'
                      : 'text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>

          <button
            onClick={toggleDarkMode}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center p-1.5 text-neutral-900 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-400"
          >
            {resolvedTheme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
