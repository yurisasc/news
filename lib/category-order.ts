import type { CategoryOrderConfig } from "./types";

// Default category order for consistent display
export const DEFAULT_CATEGORY_ORDER: CategoryOrderConfig = {
  Hero: 0,
  "At a Glance": 1,
  "International Affairs": 2,
  "Politics & Government": 3,
  "Economy & Business": 4,
  "Social & Humanitarian": 5,
  "Sports & Culture": 6,
};

// Fallback order for categories not in predefined list
export const FALLBACK_ORDER = 100;

// Get the display order for a category
export function getCategoryOrder(categoryName: string): number {
  return DEFAULT_CATEGORY_ORDER[categoryName] ?? FALLBACK_ORDER;
}

// Sort categories by their canonical order
export function sortCategories<T extends { title: string }>(categories: T[]): T[] {
  return [...categories].sort((a, b) => {
    const orderA = getCategoryOrder(a.title);
    const orderB = getCategoryOrder(b.title);
    return orderA - orderB;
  });
}
