"use client";
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <nav className="p-4 border-b border-gray-400">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Name */}
        <Link
          href="/"
          className="text-2xl font-bold relative inline-block transition-all duration-300 hover:text-blue-500 dark:hover:text-blue-400"
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
              className={`px-4 py-2 border rounded-md transition ${
                pathname === "/resume"
                  ? "bg-gray-300 text-gray-900 border-black dark:border-white dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Resume 📰
            </Link>
            <Link
              href="/projects"
              className={`px-4 py-2 border rounded-md transition ${
                pathname === "/projects"
                  ? "bg-gray-300 text-gray-900 border-black dark:border-white dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Projects 🚀
            </Link>
            <Link
              href="/university"
              className={`px-4 py-2 border rounded-md transition ${
                pathname === "/university"
                  ? "bg-gray-300 text-gray-900 border-black dark:border-white dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              University 🏛️
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="inline-flex items-center justify-center transition"
            style={{ fontSize: '1.5rem' }}
          >
            <span
              style={{
                display: 'inline-block',
                filter: theme === 'dark' 
                  ? 'drop-shadow(0px 0px 12px rgba(255, 255, 0, 0.8))' 
                  : 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.8))',
              }}
            >
              {theme === 'dark' ? '☀️' : '🌒'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
