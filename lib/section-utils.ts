import type { CategorySection } from "@/lib/types";

/**
 * Maps section IDs to their display titles
 */
export function getSectionTitle(sectionId: string, sections?: CategorySection[]): string {
  // Special sections
  if (sectionId === "hero") return "Breaking News";
  if (sectionId === "at-a-glance") return "At a Glance";

  // For category sections, try to find matching section by title
  if (sections) {
    const matchingSection = sections.find(
      (s) => s.title.toLowerCase().replace(/\s+/g, "-") === sectionId,
    );
    if (matchingSection) return matchingSection.title;
  }

  // Fallback: convert kebab-case to Title Case
  return sectionId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts a section title to its ID format (kebab-case)
 */
export function titleToSectionId(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}
