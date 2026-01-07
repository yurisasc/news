import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to extract favicon from URL
export function extractFavicon(url: string): string | undefined {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return undefined;
  }
}

export type PaginatedResult<T> = {
  pages: T[][];
  totalPages: number;
  pageSize: number;
};

export function paginateArray<T>(items: T[], pageSize = 20): PaginatedResult<T> {
  const safePageSize = pageSize > 0 ? pageSize : 20;
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));

  const pages = Array.from({ length: totalPages }, (_, index) => {
    const start = index * safePageSize;
    return items.slice(start, start + safePageSize);
  });

  return { pages, totalPages, pageSize: safePageSize };
}
