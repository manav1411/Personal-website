"use client";
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FileText, FolderGit2, GraduationCap, BookOpen, Sun, Moon } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 p-4 border-b border-neutral-400 dark:border-neutral-700 bg-zinc-200 dark:bg-neutral-900">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Name */}
        <Link
          href="/"
          className="text-2xl font-bold relative inline-block hover:text-blue-500 dark:hover:text-blue-400"
        >
          Manav Dodia
          <span className="absolute left-0 bottom-0 block w-full h-1 bg-blue-500 dark:bg-blue-400 transition-transform transform scale-x-0 hover:scale-x-100"></span>
        </Link>

        {/* Container for navigation links and dark mode toggle */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Navigation Links */}
          <div className="space-x-4">
            <Link
              href="/resume"
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-md ${
                pathname === "/resume"
                  ? "bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100"
                  : "text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              <FileText size={16} />
              Resume
            </Link>
            <Link
              href="/projects"
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-md ${
                pathname === "/projects"
                  ? "bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100"
                  : "text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              <FolderGit2 size={16} />
              Projects
            </Link>
            <Link
              href="/university"
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-md ${
                pathname === "/university"
                  ? "bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100"
                  : "text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              <GraduationCap size={16} />
              University
            </Link>
            <Link
              href="/learn"
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-md ${
                pathname === "/learn"
                  ? "bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100"
                  : "text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              <BookOpen size={16} />
              Learn
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center text-neutral-900 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-400"
          >
            {resolvedTheme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
