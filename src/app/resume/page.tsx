"use client";
import { useEffect, useState } from 'react';

export default function ResumePage() {
  const [height, setHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to update height
    const updateHeight = () => {
      // Estimated Navbar height. Adjust if needed.
      const navbarHeight = 74;
      setHeight(window.innerHeight - navbarHeight);
    };

    // Set initial height
    updateHeight();

    // Update height on window resize
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <main className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p>the Resume will be loaded soon...</p>
        </div>
      )}
      <embed
        src="https://drive.google.com/file/d/1w_8RAJoUtdYHCvIrstKWeZQQt_HCRA7M/preview?usp=sharing"
        type="application/pdf"
        style={{ width: '100%', height: `${height}px` }}
        className="w-full"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </main>
  );
}
