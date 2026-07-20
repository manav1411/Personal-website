import { FC } from 'react';
import Link from 'next/link';
import { Puzzle, Terminal, Wrench, ArrowRight } from 'lucide-react';
import LearnNav from '@/components/learn/LearnNav';
import CohortLeaderboard from '@/components/learn/CohortLeaderboard';
import MockTimer from '@/components/learn/MockTimer';
import cohort from '@/data/cohortData';

const resources = [
  {
    href: '/learn/patterns',
    icon: Puzzle,
    title: 'Pattern library',
    desc: 'Recognition cues + Python templates for every core pattern, with problems to drill.',
  },
  {
    href: '/learn/python',
    icon: Terminal,
    title: 'Python for LeetCode',
    desc: 'The stdlib and idioms that keep solutions short, fast, and bug-free.',
  },
  {
    href: '/learn/toolkit',
    icon: Wrench,
    title: 'Problem-solving toolkit',
    desc: 'A repeatable method, constraints → complexity cheats, and a Big-O reference.',
  },
];

const OtherPage: FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="w-full max-w-4xl mt-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold mb-3">Other</h1>
            <p className="text-lg text-neutral-700 dark:text-neutral-300">
              A space for experimentation — reference material and tools that
              aren&apos;t part of the weekly loop (yet).
            </p>
          </div>
          <div className="mt-2 shrink-0">
            <LearnNav />
          </div>
        </div>
      </header>

      {/* Leaderboard + mock timer, squished side-by-side to avoid wasted space */}
      <section className="w-full max-w-4xl mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
          <CohortLeaderboard members={cohort} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Mock timer</h2>
          <MockTimer />
        </div>
      </section>

      <section className="w-full max-w-4xl mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="group dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon size={18} className="text-blue-500" />
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                {title}
              </span>
              <ArrowRight
                size={15}
                className="ml-auto text-neutral-400 dark:text-neutral-500 group-hover:text-blue-500"
              />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{desc}</p>
          </Link>
        ))}
      </section>

      <footer className="mt-20 mb-5">
        <p className="text-sm text-neutral-500 text-center">
          Made with ✨, powered by ☕
          <br />
          by Manav Dodia
        </p>
      </footer>
    </main>
  );
};

export default OtherPage;
