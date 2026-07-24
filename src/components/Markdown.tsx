// Shared Markdown renderer used by the admin editor preview and the public
// slide deck, so both stay perfectly in sync. GitHub-flavoured Markdown adds
// tables, task lists, strikethrough, etc. Styling comes from Tailwind's
// typography plugin (`prose`); fenced code is highlighted as Python to match
// the course language.

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);

function highlightPython(source: string): string {
  try {
    return hljs.highlight(source, { language: 'python' }).value;
  } catch {
    return hljs.highlightAuto(source, ['python']).value;
  }
}

const components: Components = {
  // Let the `code` renderer own the <pre> so we control the whole block.
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const text = String(children).replace(/\n$/, '');
    const language = /language-(\w+)/.exec(className || '')?.[1];
    // Fenced blocks get a language class (or are multi-line); bare `code` is inline.
    const isBlock =
      Boolean(language) || text.includes('\n') || className?.includes('language-');

    if (!isBlock) {
      return <code className="md-inline-code">{text}</code>;
    }

    const html = highlightPython(text);
    return (
      <pre className="md-code-block not-prose">
        <code
          className="hljs language-python"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    );
  },
};

export default function Markdown({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return (
    <div
      className={`prose prose-neutral dark:prose-invert max-w-none prose-code:before:content-none prose-code:after:content-none ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
