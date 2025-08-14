"use client";
import { useEffect, useState } from "react";

export default function ResumePage() {
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      const navbarHeight = 74; // adjust to your navbar
      setHeight(window.innerHeight - navbarHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <main className="w-full" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white">
          <p>the Resume will be loaded soon...</p>
        </div>
      )}
      <iframe
        src="./Resume.pdf"
        style={{ width: "100%", height: `${height}px`, border: "none" }}
        onLoad={() => setLoading(false)}
      />
    </main>
  );
}
