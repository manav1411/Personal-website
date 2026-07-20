import { FC } from 'react';
import LearnNav from '@/components/learn/LearnNav';
import PatternLibrary from '@/components/learn/PatternLibrary';

const PatternsPage: FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="w-full max-w-4xl mt-16">
        <h1 className="text-5xl font-bold mb-3">Pattern library</h1>
        <p className="text-lg text-neutral-700 dark:text-neutral-300">
          The reusable core. For each pattern: how to recognise it, a Python
          template to adapt, and problems to drill it on.
        </p>
      </header>

      <div className="w-full max-w-4xl mt-6">
        <LearnNav />
      </div>

      <section className="w-full max-w-4xl mt-8">
        <PatternLibrary />
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

export default PatternsPage;
