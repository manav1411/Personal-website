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

    const updateWidth = () => {
      // Floor + ignore sub-pixel churn so ResizeObserver doesn't fight the
      // canvas (which can look like a slow zoom into the top-left).
      // Leave room for the 1px border on each side so the canvas can't
      // overflow and trigger mobile browser zoom-out.
      const next = Math.max(
        Math.min(Math.floor(container.clientWidth) - 2, 768),
        0,
      );
      setPageWidth((prev) => (prev === next ? prev : next));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-8 pt-16 min-w-0">
      <div ref={containerRef} className="w-full min-w-0 max-w-full">
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

        {pageWidth !== undefined && pageWidth > 0 && (
          <Document
            file={RESUME_URL}
            loading={null}
            onLoadSuccess={() => setLoading(false)}
            onLoadError={() => {
              setLoading(false);
              setError(true);
            }}
            className={loading || error ? "hidden" : "flex justify-center w-full min-w-0"}
          >
            <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-xl shadow-neutral-400/60 dark:border-neutral-700 dark:shadow-none">
              <Page
                pageNumber={1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="!max-w-full"
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
