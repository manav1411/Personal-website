// Shared Markdown renderer used by the admin editor preview and the public
// slide deck, so both stay perfectly in sync. GitHub-flavoured Markdown adds
// tables, task lists, strikethrough, etc. Styling comes from Tailwind's
// typography plugin (`prose`); we only tune spacing/size via the `className`.
// Inline `code` gets a subtle pill (typography's default decorative backticks
// are disabled so it doesn't look like raw markdown).

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Markdown({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return (
    <div
      className={`prose prose-neutral dark:prose-invert max-w-none prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-300 dark:prose-pre:border-neutral-700 prose-code:rounded prose-code:bg-neutral-200/80 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:code:bg-transparent prose-pre:code:p-0 prose-pre:code:rounded-none ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
