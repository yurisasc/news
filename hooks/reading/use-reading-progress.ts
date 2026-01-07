"use client";

import { useEffect, useState } from "react";
import type { ReadingProgress } from "@/lib/types";

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress>({
    scrollPosition: 0,
    maxScrollPosition: 0,
    totalContentHeight: 0,
    percentage: 0,
    sectionsRead: [],
    currentSection: null,
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const totalScrollable = documentHeight - windowHeight;

          const percentage =
            totalScrollable > 0 ? Math.min(100, Math.round((scrollY / totalScrollable) * 100)) : 0;

          setProgress((prev) => ({
            ...prev,
            scrollPosition: scrollY,
            maxScrollPosition: Math.max(prev.maxScrollPosition, scrollY),
            totalContentHeight: documentHeight,
            percentage,
          }));

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return progress;
}
