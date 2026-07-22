'use client';

// Personalisation: type a LeetCode username to make the whole page "yours" — your
// stats card, and which homework problems you've solved. The choice is persisted
// (useLearnUsername) so it stays in focus across visits. When a user is set, the
// stats card shows with a small "Change" tab tucked into its top-right corner.

import { useEffect, useState } from 'react';
import { UserRound, Pencil, Check } from 'lucide-react';
import LeetCodeStats from '@/components/LeetCodeStats';
import { useLearnUsername } from '@/hooks/useLearnUsername';

export default function ProfilePanel() {
  const { username, setUsername, ready } = useLearnUsername();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!editing) setDraft(username);
  }, [username, editing]);

  if (!ready) {
    return (
      <div className="w-full max-w-4xl h-[4.5rem] rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    );
  }

  const save = () => {
    if (draft.trim()) {
      setUsername(draft);
      setEditing(false);
    }
  };

  if (editing || !username) {
    return (
      <div className="flex items-center gap-2 flex-wrap dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 px-3 py-2.5">
        <UserRound size={16} className="text-blue-500 shrink-0" />
        <span className="text-sm text-neutral-600 dark:text-neutral-400 shrink-0">
          Your LeetCode username
        </span>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape' && username) setEditing(false);
          }}
          placeholder="e.g. manav141"
          autoFocus
          className="flex-1 min-w-[8rem] px-2.5 py-1 text-sm rounded-md border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm border rounded-md bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
        >
          <Check size={14} />
          View
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl">
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Change username"
        className="absolute right-0 bottom-full -mb-px z-10 inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 border-b-0 rounded-t-md text-neutral-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400"
      >
        <Pencil size={11} />
        Change
      </button>
      <LeetCodeStats username={username} squareTopRight />
    </div>
  );
}
