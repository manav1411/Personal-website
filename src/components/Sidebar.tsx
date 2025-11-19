"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FileText, FolderGit2, GraduationCap } from "lucide-react"; 
// you can swap these icons for any lucide-react icon

const Sidebar = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const linkClasses = (active: boolean) =>
    `p-3 rounded-xl transition ${
      active
        ? "text-blue-500 dark:text-blue-400"
        : "text-neutral-700 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-blue-400"
    }`;

  return (
    <aside
      className="
        fixed right-4 top-1/2 -translate-y-1/2 
        flex flex-col items-center gap-6
        z-50
      "
    >
      <Link
        href="/resume"
        className={linkClasses(pathname === "/resume")}
      >
        <FileText size={26} />
      </Link>

      <Link
        href="/projects"
        className={linkClasses(pathname === "/projects")}
      >
        <FolderGit2 size={26} />
      </Link>

      <Link
        href="/university"
        className={linkClasses(pathname === "/university")}
      >
        <GraduationCap size={26} />
      </Link>
    </aside>
  );
};

export default Sidebar;
