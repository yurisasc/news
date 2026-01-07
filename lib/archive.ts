import type { NewsArticle } from "@/lib/types";

export const NEWS_PAGE_SIZE = 20;

export function paginateNews(
  articles: NewsArticle[],
  page: number,
  pageSize: number = NEWS_PAGE_SIZE,
): {
  pageItems: NewsArticle[];
  totalPages: number;
} {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(articles.length / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safePageSize;
  const end = start + safePageSize;
  const pageItems = articles.slice(start, end);
  return { pageItems, totalPages };
}

export function generateNewsPageNumbers(
  totalArticles: number,
  pageSize: number = NEWS_PAGE_SIZE,
): number[] {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalArticles / safePageSize));
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}
