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

  // Restore scroll position from localStorage on mount
  useEffect(() => {
    if (isLoaded && !hasRestoredScrollRef.current && completionState.scrollPercentage > 0) {
      // Calculate scroll position based on percentage
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScrollPosition = (completionState.scrollPercentage / 100) * totalScrollHeight;

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

  // Sync observed sections to completion state (debounced)
  useEffect(() => {
    if (observedSectionsRead.length > 0) {
      updateSectionsRead(observedSectionsRead);
    }
  }, [observedSectionsRead, updateSectionsRead]);

  // Register hero and at-a-glance sections when refs are set
  useEffect(() => {
    if (heroRef.current) registerSection("hero", heroRef.current);
    if (atAGlanceRef.current) registerSection("at-a-glance", atAGlanceRef.current);
  }, [registerSection]);

  // Update progress with section info and check for completion
  useEffect(() => {
    updateProgress(progress.percentage);

    // Trigger celebration only when all sections are actually read
    const allSectionsRead = sectionsRead.length === totalSections;

    if (allSectionsRead && !showCelebration && !completionState.isComplete) {
      markComplete();
      setShowCelebration(true);
    }
  }, [
    progress.percentage,
    sectionsRead.length,
    totalSections,
    showCelebration,
    completionState.isComplete,
    updateProgress,
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
