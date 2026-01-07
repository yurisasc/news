"use client";

import { useEffect, useRef, useState } from "react";
import { useCompletionState } from "./use-completion-state";
import { useReadingProgress } from "./use-reading-progress";
import { useSectionObserver } from "./use-section-observer";

export interface UnifiedReadingProgressState {
  // Progress state
  percentage: number;
  scrollPosition: number;
  currentSection: string | null;
  sectionsRead: string[];
  totalSections: number;

  // Completion state
  isComplete: boolean;
  showCelebration: boolean;

  // Actions
  dismissCelebration: () => void;
  registerSection: (id: string, element: HTMLElement | null) => void;
  registerHeroSection: (element: HTMLElement | null) => void;
  registerAtAGlanceSection: (element: HTMLElement | null) => void;
}

export function useUnifiedReadingProgress(
  pageId: string,
  totalSections: number,
): UnifiedReadingProgressState {
  const progress = useReadingProgress();
  const {
    currentSection,
    sectionsRead: observedSectionsRead,
    registerSection,
  } = useSectionObserver();
  const {
    completionState,
    isLoaded,
    updateProgress,
    markComplete,
    updateSectionsRead,
    dismissCelebration: persistDismiss,
  } = useCompletionState(pageId);

  const [showCelebration, setShowCelebration] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const atAGlanceRef = useRef<HTMLElement | null>(null);
  const hasRestoredScrollRef = useRef(false);
  const lastSyncedSectionsRef = useRef<string[]>([]);
  const lastProgressUpdateRef = useRef<number>(0);

  // Restore scroll position from localStorage on mount
  useEffect(() => {
    if (isLoaded && !hasRestoredScrollRef.current && completionState.scrollPercentage > 0) {
      // If scroll percentage is less than 5%, treat as 0% (top of page)
      const percentageToRestore =
        completionState.scrollPercentage < 5 ? 0 : completionState.scrollPercentage;

      // Calculate scroll position based on percentage
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScrollPosition = (percentageToRestore / 100) * totalScrollHeight;

      // Scroll to the saved position
      window.scrollTo(0, targetScrollPosition);
      hasRestoredScrollRef.current = true;
    }
  }, [isLoaded, completionState.scrollPercentage]);

  // Use persisted sectionsRead if available, otherwise use observed
  const sectionsRead =
    (completionState.sectionsRead?.length ?? 0) > 0
      ? (completionState.sectionsRead ?? [])
      : observedSectionsRead;

  // Sync observed sections to completion state
  useEffect(() => {
    if (observedSectionsRead.length > 0) {
      // Only update if sections actually changed to prevent infinite loop
      const lastSynced = lastSyncedSectionsRef.current;
      const sectionsChanged =
        observedSectionsRead.length !== lastSynced.length ||
        observedSectionsRead.some((s) => !lastSynced.includes(s));

      if (sectionsChanged) {
        lastSyncedSectionsRef.current = observedSectionsRead;
        updateSectionsRead(observedSectionsRead);
      }
    }
  }, [observedSectionsRead, updateSectionsRead]);

  // Register hero and at-a-glance sections when refs are set
  useEffect(() => {
    if (heroRef.current) registerSection("hero", heroRef.current);
    if (atAGlanceRef.current) registerSection("at-a-glance", atAGlanceRef.current);
  }, [registerSection]);

  // Update progress only when it changes
  useEffect(() => {
    if (progress.percentage !== lastProgressUpdateRef.current) {
      lastProgressUpdateRef.current = progress.percentage;
      updateProgress(progress.percentage);
    }
  }, [progress.percentage, updateProgress]);

  // Check for completion and trigger celebration
  useEffect(() => {
    const allSectionsRead = sectionsRead.length === totalSections;

    if (allSectionsRead && !showCelebration && !completionState.isComplete) {
      markComplete();
      setShowCelebration(true);
    }
  }, [
    sectionsRead.length,
    totalSections,
    showCelebration,
    completionState.isComplete,
    markComplete,
  ]);

  // Show celebration if already completed today and not dismissed
  useEffect(() => {
    if (
      isLoaded &&
      completionState.isComplete &&
      !showCelebration &&
      !completionState.hasDismissedCelebration
    ) {
      setShowCelebration(true);
    }
  }, [
    isLoaded,
    completionState.isComplete,
    showCelebration,
    completionState.hasDismissedCelebration,
  ]);

  const dismissCelebration = () => {
    setShowCelebration(false);
    // Persist dismissal to localStorage
    persistDismiss();
  };

  const registerHeroSection = (element: HTMLElement | null) => {
    heroRef.current = element;
  };

  const registerAtAGlanceSection = (element: HTMLElement | null) => {
    atAGlanceRef.current = element;
  };

  return {
    percentage: progress.percentage,
    scrollPosition: progress.scrollPosition,
    currentSection,
    sectionsRead,
    totalSections,
    isComplete: completionState.isComplete,
    showCelebration,
    dismissCelebration,
    registerSection,
    registerHeroSection,
    registerAtAGlanceSection,
  };
}
