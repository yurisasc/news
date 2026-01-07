"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getSectionTitle } from "@/lib/section-utils";
import type { CategorySection, ReadingProgress as ReadingProgressType } from "@/lib/types";

interface ReadingProgressProps {
  progress: ReadingProgressType;
  totalSections: number;
  sections?: CategorySection[];
}

export function ReadingProgress({ progress, totalSections, sections }: ReadingProgressProps) {
  const { percentage, currentSection, sectionsRead } = progress;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border shadow-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-2">
          {/* Progress bar */}
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Reading progress: ${percentage}%`}
            />
          </div>

          {/* Percentage and section info */}
          <div className="flex items-center gap-3 text-sm shrink-0">
            {percentage === 100 ? (
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                <Check className="w-4 h-4" />
                <span className="font-semibold">Complete</span>
              </div>
            ) : (
              <>
                <span className="font-semibold tabular-nums">{percentage}%</span>
                <span className="text-muted-foreground">
                  {sectionsRead.length}/{totalSections}
                </span>
                {currentSection && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground max-w-[150px] truncate hidden sm:inline-block">
                      {getSectionTitle(currentSection, sections)}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
