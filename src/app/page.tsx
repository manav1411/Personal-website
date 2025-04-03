"use client";
import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaRegCopy } from 'react-icons/fa';
import { IoMdCheckmark } from 'react-icons/io';
import ProjectCard from '@/components/ProjectCard';
import projects from '@/data/projectsData';
import experiences from '@/data/homeExperiencesData';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('manavbdodia@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <main className="flex min-h-screen flex-col pt-16">
      <div className="flex">
        {/* Header Section */}
        <header className="w-full max-w-4xl mb-16 mt-20">
          <h1 className="text-6xl font-bold mb-4">
            Hi, I'm Manav
          </h1>

          <p className="text-lg">
          I'm in my final year of CS at UNSW, <br /> and am interested in Security.
            <br />

          </p>
          <div>
            <p className="text-lg pt-14">
              Contact me at <span className="text-blue-500 font-semibold">manavbdodia@gmail.com</span>
              <button 
                onClick={copyToClipboard} 
                className="ml-2 bg-transparent rounded transition-colors duration-150 ease-in-out focus:outline-none"
                aria-label="Copy email to clipboard"
              >
                {copied ? (
                  <IoMdCheckmark className="text-green-500 w-5 h-5 transition-colors duration-150 ease-in-out" />
                ) : (
                  <FaRegCopy className="text-neutral-500 dark:text-neutral-400 w-5 h-5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 ease-in-out" />
                )}
              </button>
              {copied && <span className="mr-8 text-xs opacity-50">Copied!</span>}
            </p>
          </div>

          {/* github/linkedin Buttons */}
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
        <div className="relative w-[468px] h-[500px]">
          <Image
            src="/manav.png"
            alt="a photograph of me"
            width={208 * 2.25}
            height={302 * 2.25}
            className={`rounded-md mb-8 absolute ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src="/manavAnime.png"
            alt="an Anime illustration of me"
            width={208 * 2.25}
            height={302 * 2.25}
            className={`rounded-md mb-8 absolute ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className="absolute w-full h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </div>
      </div>


      {/* Projects */}
      <section className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold mb-6">
            Projects
          </h2>
          <Link
              href="/projects"
              className={`px-4 py-2 border rounded-md transition text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700`}
            >
              All Projects
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.slice(0, 2).map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </section>


      {/* divider */}
      <div className="w-full max-w-4xl border-b border-neutral-400 dark:border-neutral-700 mb-16 mt-16"></div>


      {/* Resume */}
      <section className="w-full max-w-4xl mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold mb-6">Experience</h2>
          <Link
            href="/resume"
            className="px-4 py-2 border rounded-md transition text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          >
            View resume
          </Link>
        </div>
        <div className="pl-4">
        {experiences.map((experience, index) => (
          <div key={index} className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-semibold">{experience.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{experience.year}</p>
            </div>
            <ul className="list-disc list-inside text-neutral-500 dark:text-neutral-400">
              {experience.details.map((detail, i) => (
                <li key={i} className="mb-2">{detail}</li>
              ))}
            </ul>
          </div>
        ))}
        </div>
      </section>



      {/* Footer */}
      <footer className="mt-32 mb-5">
        <p className="text-sm text-neutral-500 text-center">
        Made with ✨, powered by ☕
        <br />
        © 2024 Manav Dodia
        </p>
      </footer>

    </main>
  );
}
