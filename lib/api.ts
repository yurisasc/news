import "server-only";
import type {
  CuratedHomepage,
  CuratedRecord,
  NewsArticle,
  NocoDBResponse,
} from "@/lib/types";

const API_BASE = process.env.NOCODB_API_BASE;
const NEWS_TABLE = process.env.NOCODB_NEWS_TABLE;
const CURATED_TABLE = process.env.NOCODB_CURATED_TABLE;
const API_TOKEN = process.env.NOCODB_API_TOKEN;

// Add metadata to news article
export function enrichNewsArticle(article: NewsArticle): NewsArticle {
  try {
    if (article.fields.URL) {
      const urlObj = new URL(article.fields.URL);
      article.favicon = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    }
    return article;
  } catch {
    return article;
  }
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (API_TOKEN) {
    headers["xc-token"] = API_TOKEN;
  }

  return headers;
}

export async function fetchCuratedHomepage(): Promise<CuratedHomepage | null> {
  try {
    const sortParam = JSON.stringify({ field: "Date", direction: "desc" });
    const response = await fetch(
      `${API_BASE}/${CURATED_TABLE}/records?sort=${encodeURIComponent(
        sortParam,
      )}&pageSize=1`,
      {
        headers: getHeaders(),
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch curated homepage:",
        response.status,
        response.statusText,
      );
      return null;
    }

    const data: NocoDBResponse<CuratedRecord["fields"]> = await response.json();

    if (data.records && data.records.length > 0) {
      return data.records[0].fields.Data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching curated homepage:", error);
    return null;
  }
}

export async function fetchAllCuratedHomepages(): Promise<CuratedRecord[]> {
  try {
    const sortParam = JSON.stringify({ field: "Date", direction: "desc" });
    const response = await fetch(
      `${API_BASE}/${CURATED_TABLE}/records?sort=${encodeURIComponent(
        sortParam,
      )}`,
      {
        headers: getHeaders(),
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data: NocoDBResponse<CuratedRecord["fields"]> = await response.json();
    return data.records || [];
  } catch (error) {
    console.error("Error fetching curated archives:", error);
    return [];
  }
}

export async function fetchNewsArchive(limit = 100): Promise<NewsArticle[]> {
  try {
    const sortParam = JSON.stringify({
      field: "Created Date",
      direction: "desc",
    });
    const response = await fetch(
      `${API_BASE}/${NEWS_TABLE}/records?sort=${encodeURIComponent(
        sortParam,
      )}&pageSize=${limit}`,
      {
        headers: getHeaders(),
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data: NocoDBResponse<NewsArticle["fields"]> = await response.json();
    return (data.records || []).map(enrichNewsArticle);
  } catch (error) {
    console.error("Error fetching news archive:", error);
    return [];
  }
}

export async function fetchNewsById(id: string): Promise<NewsArticle | null> {
  try {
    const response = await fetch(`${API_BASE}/${NEWS_TABLE}/records/${id}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const record: NewsArticle = await response.json();
    return enrichNewsArticle(record);
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    return null;
  }
}
