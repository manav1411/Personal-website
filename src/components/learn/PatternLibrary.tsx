'use client';

// Filterable/searchable view over the pattern library.

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import patterns, { patternCategories } from '@/data/patternsData';
import PatternCard from './PatternCard';

export default function PatternLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patterns.filter((p) => {
      if (category && p.category !== category) return false;
      if (!q) return true;
      const haystack = [
        p.name,
        p.idea,
        p.category,
        ...p.triggers,
        ...p.problems.map((problem) => problem.name),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  return (
    <div>
      {/* Controls */}
      <div className="relative mb-3">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patterns, triggers, or problems…"
          className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`px-3 py-1 text-sm rounded-md border ${
            category === null
              ? 'bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100'
              : 'text-neutral-700 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700'
          }`}
        >
          All
        </button>
        {patternCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 text-sm rounded-md border ${
              category === cat
                ? 'bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100'
                : 'text-neutral-700 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
          No patterns match that search.
        </p>
      ) : (
        <div className="space-y-5">
          {filtered.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      )}
    </div>
  );
}
