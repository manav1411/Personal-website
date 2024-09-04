"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const pathname = usePathname();  // Use usePathname to get the current path

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  

  return (
    <nav className="p-4 border-b border-gray-400">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Name */}
        <Link 
  href="/" 
  className="text-xl font-bold text-gray-900 dark:text-gray-100 relative inline-block transition-all duration-300 hover:text-blue-500 dark:hover:text-blue-400">
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
                  ? "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Resume
            </Link>
            <Link
              href="/projects"
              className={`px-4 py-2 border rounded-md transition ${
                pathname === "/projects"
                  ? "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Projects
            </Link>
            <Link
              href="/university"
              className={`px-4 py-2 border rounded-md transition ${
                pathname === "/university"
                  ? "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              University
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
      filter: 'drop-shadow(0px 0px 12px rgba(255, 255, 0, 0.6))',
    }}
  >
    {darkMode ? "☀️" : "🌒"}
  </span>
</button>



        </div>
      </div>
    </nav>
  );
};

export default Navbar;
