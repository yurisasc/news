"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionInfo } from "@/lib/types";

export function useSectionObserver() {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [sectionsRead, setSectionsRead] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const isIntersecting = entry.isIntersecting;

          // Update current section
          if (isIntersecting) {
            setCurrentSection(sectionId);
          }

          // Mark section as read when it's leaving the viewport (user scrolled past it)
          if (!isIntersecting && entry.boundingClientRect.top < 0) {
            setSectionsRead((prev) => {
              const newRead = new Set(prev);
              newRead.add(sectionId);
              return newRead;
            });
          }

          // Also mark as read if section is fully visible (for last sections)
          if (isIntersecting && entry.intersectionRatio >= 0.9) {
            setSectionsRead((prev) => {
              const newRead = new Set(prev);
              newRead.add(sectionId);
              return newRead;
            });
          }
        });
      },
      {
        threshold: [0, 0.9], // Trigger at 0% and 90% visibility
        rootMargin: "0px 0px -100% 0px", // Also trigger when section is completely above viewport
      },
    );

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, []);

  // Mark all sections as read when scrolled to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate scroll percentage (0 to 100)
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;

      // If we've scrolled past 98% of the page, mark all sections as read
      if (scrollPercentage >= 0.98) {
        sectionRefs.current.forEach((_, id) => {
          setSectionsRead((prev) => {
            const newRead = new Set(prev);
            newRead.add(id);
            return newRead;
          });
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const registerSection = (id: string, element: HTMLElement | null) => {
    if (!element) return;

    sectionRefs.current.set(id, element);

    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  const getSectionInfo = (): SectionInfo[] => {
    const info: SectionInfo[] = [];
    sectionRefs.current.forEach((element, id) => {
      const rect = element.getBoundingClientRect();
      info.push({
        id,
        title: id,
        order: 0,
        offsetTop: element.offsetTop,
        height: rect.height,
        isRead: sectionsRead.has(id),
      });
    });
    return info.sort((a, b) => a.offsetTop - b.offsetTop);
  };

  return {
    currentSection,
    sectionsRead: Array.from(sectionsRead),
    registerSection,
    getSectionInfo,
  };
}
