'use client';

// Personalisation: type a LeetCode username to make the whole page "yours" — your
// stats card, and which homework problems you've solved. The choice is persisted
// (useLearnUsername) so it stays in focus across visits. When a user is set, the
// stats card shows with a small "Change" tab tucked into its top-right corner.

import { useEffect, useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import LeetCodeStats from '@/components/LeetCodeStats';
import { useLearnUsername } from '@/hooks/useLearnUsername';

const tabClassName =
  'absolute right-0 bottom-full -mb-px z-10 inline-flex items-center gap-1.5 bg-zinc-200 dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-t-md transition-[width] duration-200 ease-out';

export default function ProfilePanel() {
  const { username, setUsername, ready } = useLearnUsername();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (ready && !username) setEditing(true);
  }, [ready, username]);

  const openEditor = () => {
    setDraft('');
    setEditing(true);
  };

  const save = () => {
    if (draft.trim()) {
      setUsername(draft);
    }
    setDraft('');
    setEditing(false);
  };

  const cancel = () => {
    setDraft('');
    setEditing(false);
  };

  if (!ready) {
    return (
      <div className="w-full max-w-4xl h-[4.5rem] rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    );
  }

  return (
    <div className="relative w-full max-w-4xl">
      <div className={`${tabClassName} ${editing ? 'px-2 py-1' : ''}`}>
        {editing ? (
          <>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save();
                if (e.key === 'Escape') cancel();
              }}
              placeholder="LeetCode username"
              autoFocus
              className="w-36 px-2 py-0.5 text-xs rounded border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={save}
              aria-label="Save username"
              className="inline-flex items-center px-1.5 py-0.5 text-xs border rounded bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
            >
              <Check size={12} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={openEditor}
            aria-label="Change username"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <Pencil size={11} />
            Change
          </button>
        )}
      </div>
      <LeetCodeStats username={username || 'manav141'} squareTopRight />
    </div>
  );
}
