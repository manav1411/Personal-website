export default function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="p-4 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 overflow-x-auto text-sm font-mono text-neutral-800 dark:text-neutral-200">
      <code>{code}</code>
    </pre>
  );
}
