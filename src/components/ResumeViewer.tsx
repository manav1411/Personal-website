"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const RESUME_URL = "/resume.pdf";
const buttonClassName =
  "inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700";

export default function ResumeViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => setPageWidth(Math.min(container.clientWidth, 768));

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-8 pt-16">
      <div ref={containerRef} className="w-full">
        {loading && !error && (
          <div className="flex min-h-[70vh] items-center justify-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              Loading resume...
            </p>
          </div>
        )}

        {error && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-300">
              Could not load the resume preview.
            </p>
            <a
              href={RESUME_URL}
              className="text-sm text-blue-500 hover:text-blue-400"
            >
              Open PDF instead
            </a>
          </div>
        )}

        {pageWidth !== undefined && (
          <Document
            file={RESUME_URL}
            loading={null}
            onLoadSuccess={() => setLoading(false)}
            onLoadError={() => {
              setLoading(false);
              setError(true);
            }}
            className={loading || error ? "hidden" : "flex justify-center"}
          >
            <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-xl shadow-neutral-400/60 dark:border-neutral-700 dark:shadow-none">
              <Page
                pageNumber={1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          </Document>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <a href={RESUME_URL} download className={buttonClassName}>
          <Download size={16} aria-hidden="true" />
          download
        </a>
      </div>
    </div>
  );
}
