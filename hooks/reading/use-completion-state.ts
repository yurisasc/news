"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CompletionState } from "@/lib/types";

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function getStorageKey(pageId: string): string {
  return `obluda_progress_${pageId}`;
}

export function useCompletionState(pageId: string) {
  const STORAGE_KEY = getStorageKey(pageId);

  const [completionState, setCompletionState] = useState<CompletionState>({
    pageId,
    date: getTodayDate(),
    completedAt: null,
    isComplete: false,
    scrollPercentage: 0,
    sectionsRead: [],
    hasDismissedCelebration: false,
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const lastSavedPercentageRef = useRef<number>(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CompletionState;
        const today = getTodayDate();

        // Reset if it's a new day or pageId doesn't match
        if (parsed.date !== today || parsed.pageId !== pageId) {
          localStorage.removeItem(STORAGE_KEY);
          setCompletionState({
            pageId,
            date: today,
            completedAt: null,
            isComplete: false,
            scrollPercentage: 0,
            sectionsRead: [],
            hasDismissedCelebration: false,
          });
        } else {
          setCompletionState(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load completion state:", error);
      // If there's an error, clear the corrupted data
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, [STORAGE_KEY, pageId]);

  // Save to localStorage whenever state changes (debounced)
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completionState));
      } catch (error) {
        console.error("Failed to save completion state:", error);
      }
    }, 200); // Reduced debounce from 500ms to 200ms for faster saves

    return () => clearTimeout(timeoutId);
  }, [completionState, isLoaded, STORAGE_KEY]);

  const updateProgress = useCallback((percentage: number) => {
    // Only update if percentage changed by at least 5% to reduce state updates
    const threshold = 5;
    const diff = Math.abs(percentage - lastSavedPercentageRef.current);

    if (diff >= threshold || percentage === 100) {
      // Check if the new value is actually different from current state
      setCompletionState((prev) => {
        if (prev.scrollPercentage === percentage) {
          return prev; // No change, don't update
        }
        lastSavedPercentageRef.current = percentage;
        return {
          ...prev,
          scrollPercentage: percentage,
        };
      });
    }
  }, []);

  const markComplete = useCallback(() => {
    setCompletionState((prev) => ({
      ...prev,
      isComplete: true,
      completedAt: new Date().toISOString(),
      scrollPercentage: 100,
    }));
  }, []);

  const updateSectionsRead = useCallback(
    (sections: string[]) => {
      setCompletionState((prev) => {
        const newState = {
          ...prev,
          sectionsRead: sections,
        };
        // Immediately save to localStorage to ensure persistence
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        } catch (error) {
          console.error("Failed to save sections:", error);
        }
        return newState;
      });
    },
    [STORAGE_KEY],
  );

  const dismissCelebration = () => {
    setCompletionState((prev) => ({
      ...prev,
      hasDismissedCelebration: true,
    }));
  };

  const reset = () => {
    setCompletionState({
      pageId,
      date: getTodayDate(),
      completedAt: null,
      isComplete: false,
      scrollPercentage: 0,
      sectionsRead: [],
      hasDismissedCelebration: false,
    });
  };

  return {
    completionState,
    isLoaded,
    updateProgress,
    markComplete,
    updateSectionsRead,
    dismissCelebration,
    reset,
  };
}
