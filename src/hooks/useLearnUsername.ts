'use client';

// The single "who am I" for the /learn page. The chosen LeetCode username is
// persisted in localStorage so it stays in focus across visits, and changes are
// broadcast so every part of the page (stats, week progress, leaderboard) reacts.

import { useCallback, useEffect, useState } from 'react';

const KEY = 'learn:username';
const EVENT = 'learn:username-change';
const DEFAULT = 'manav141';

export interface UseLearnUsername {
  username: string;
  setUsername: (u: string) => void;
  /** False until localStorage has been read on the client (avoids a flash). */
  ready: boolean;
}

export function useLearnUsername(): UseLearnUsername {
  const [username, setUsernameState] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setUsernameState(window.localStorage.getItem(KEY) ?? DEFAULT);
      } catch {
        setUsernameState(DEFAULT);
      }
      setReady(true);
    };
    read();

    const onEvent = () => {
      try {
        setUsernameState(window.localStorage.getItem(KEY) ?? DEFAULT);
      } catch {
        // ignore
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY || e.key === null) onEvent();
    };
    window.addEventListener(EVENT, onEvent);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT, onEvent);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setUsername = useCallback((u: string) => {
    const trimmed = u.trim();
    try {
      window.localStorage.setItem(KEY, trimmed);
    } catch {
      // ignore unavailable storage
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { username, setUsername, ready };
}
