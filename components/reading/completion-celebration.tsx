"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CompletionCelebrationProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export function CompletionCelebration({ isVisible, onDismiss }: CompletionCelebrationProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setShouldShow(isVisible);
  }, [isVisible]);

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onDismiss}
        aria-label="Close celebration"
      />
      <div className="relative z-10 bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
        {/* Decorative elements */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="bg-primary rounded-full p-4 shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-serif font-bold mb-3">All Caught Up!</h2>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            You've completed today's news summary. Stay informed and come back tomorrow for the
            latest updates.
          </p>

          <div className="bg-accent/50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-accent-foreground">
              Great job staying on top of the news! 🎉
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              Continue Reading
            </button>
            <Link href="/archive" className="block">
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
              >
                Read Archives
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
