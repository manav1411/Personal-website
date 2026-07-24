'use client';

// Lightweight overlay dialog. Closes on Escape or backdrop click. Used to show a
// week's slides or homework without leaving the page.

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Fill the whole viewport instead of a centered dialog box. */
  fullscreen?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  fullscreen = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] bg-black/50 ${
        fullscreen ? '' : 'flex items-start justify-center p-4 sm:p-8 overflow-y-auto'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={
          fullscreen
            ? 'flex flex-col w-full h-full bg-zinc-100 dark:bg-neutral-900'
            : 'w-full max-w-3xl my-auto bg-zinc-100 dark:bg-neutral-900 border border-neutral-400 dark:border-neutral-600 rounded-lg shadow-xl'
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-neutral-300 dark:border-neutral-700 shrink-0">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          >
            <X size={18} />
          </button>
        </div>
        <div
          className={
            fullscreen
              ? 'flex-1 min-h-0 overflow-hidden p-6 flex flex-col'
              : 'p-4'
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
