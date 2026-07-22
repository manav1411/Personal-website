"use client";

import dynamic from "next/dynamic";

const ResumeViewer = dynamic(() => import("@/components/ResumeViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[70vh] items-center justify-center pt-16">
      <p className="text-neutral-500 dark:text-neutral-400">Loading resume...</p>
    </div>
  ),
});

export default function ResumePage() {
  return (
    <main className="w-full">
      <ResumeViewer />

      <footer className="mt-16 mb-5">
        <p className="text-sm text-neutral-500 text-center">
          Made with ✨, powered by ☕
          <br />
          by Manav Dodia
        </p>
      </footer>
    </main>
  );
}
