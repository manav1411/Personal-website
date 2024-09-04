"use client";
import { useEffect, useState } from 'react';

export default function ResumePage() {
  const [height, setHeight] = useState<number>(0);

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
    <main className="w-full h-full">
      <embed
        src="https://drive.google.com/file/d/1w_8RAJoUtdYHCvIrstKWeZQQt_HCRA7M/preview?usp=sharing"
        type="application/pdf"
        style={{ width: '100%', height: `${height}px` }}
        className="w-full"
      />
    </main>
  );
}
