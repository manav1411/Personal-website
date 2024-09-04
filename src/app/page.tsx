"use client";
import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaRegCopy } from 'react-icons/fa';
import { IoMdCheckmark } from 'react-icons/io';
import { SlCopyButton } from '@shoelace-style/shoelace';

export default function Home() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('manavbdodia@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };


  return (
    <main className="flex min-h-screen flex-col pt-12">
      <div className="flex">
      {/* Header Section */}
      <header className="w-full max-w-4xl mb-16 mt-32">
        <h1 className="text-6xl font-bold mb-4">
          Hi, I'm Manav
        </h1>
        <p className="text-lg">
          A final year Computer Science student at UNSW.
          <br />
        </p>
        <div>
        <p className="text-lg">
      Contact me at <span className="text-blue-500 font-semibold">manavbdodia@gmail.com</span>
      <button 
        onClick={copyToClipboard} 
        className="ml-2 bg-transparent rounded transition-colors duration-150 ease-in-out focus:outline-none"
        aria-label="Copy email to clipboard"
      >
        {copied ? (
          <IoMdCheckmark className="text-green-500 w-5 h-5 transition-colors duration-150 ease-in-out" />
        ) : (
          <FaRegCopy className="text-gray-500 dark:text-gray-400 w-5 h-5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 ease-in-out" />
        )}
      </button>
      {copied && <span className="mr-8 text-xs opacity-50">Copied!</span>}
    </p>
</div>

      {/* Icon Buttons Section */}
      <div className="flex space-x-4 mt-4 justify-self-auto">
      <a href="https://github.com/manav1411" target="_blank" rel="noopener noreferrer">
  <button className="">
    <FaGithub className="w-8 h-8 hover:text-blue-500 transition-colors duration-50 ease-in-out" />
  </button>
</a>

        <a href="https://linkedin.com/in/manav-dodia" target="_blank" rel="noopener noreferrer">
        <button className="">
    <FaLinkedin className="w-8 h-8 hover:text-blue-500 transition-colors duration-50 ease-in-out" />
  </button>
        </a>
      </div>
      </header>

      {/* Profile Picture */}
      <Image src="/manav.png" alt="Manav Dodia" width={208*1.5} height={312*1.5} className="rounded-md mb-8" />
      </div>

      <section className="w-full max-w-4xl mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold mb-6">
            Experience
          </h2>
          <Link
              href="/resume"
              className={`px-4 py-2 border rounded-md transition text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700`}
            >
              View resume
            </Link>
        </div>
        🚧 This section is under construction! 🚧
        <br />
        TODO: list contract work, experiences.
      </section>



      <section className="w-full max-w-4xl mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold mb-6">
            Projects
          </h2>
          <Link
              href="/projects"
              className={`px-4 py-2 border rounded-md transition text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700`}
            >
              All Projects
            </Link>
        </div>
        🚧 This section is under construction! 🚧
        <br />
        TODO: list a few projs here.
      </section>


      {/* Footer */}
      <footer className="">
        <p className="text-sm text-gray-500">
          some footer. ooga booga
        </p>
      </footer>
    </main>
  );
}
