import "server-only";
import type {
  CuratedHomepage,
  CuratedRecord,
  NewsArticle,
  NocoDBRecord,
  NocoDBResponse,
} from "@/lib/types";

const API_BASE = process.env.NOCODB_API_BASE;
const NEWS_TABLE = process.env.NOCODB_NEWS_TABLE;
const CURATED_TABLE = process.env.NOCODB_CURATED_TABLE;
const API_TOKEN = process.env.NOCODB_API_TOKEN;

function assertConfig() {
  if (!API_BASE || !NEWS_TABLE || !CURATED_TABLE) {
    throw new Error(
      "Missing NocoDB configuration. Ensure NOCODB_API_BASE, NOCODB_NEWS_TABLE, and NOCODB_CURATED_TABLE are set at build time.",
    );
  }
}

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

async function fetchAllRecords<T>(url: string, headers: HeadersInit): Promise<NocoDBRecord<T>[]> {
  let records: NocoDBRecord<T>[] = [];
  let nextUrl: string | undefined = url;

  while (nextUrl) {
    const response = await fetch(nextUrl, { headers });
    if (!response.ok) {
      break;
    }
    const data: NocoDBResponse<T> = await response.json();
    records = records.concat(data.records || []);
    nextUrl = data.next || undefined;
  }

  return records;
}

let newsArticlesCache: NewsArticle[] | null = null;

export async function fetchCuratedHomepage(): Promise<CuratedHomepage | null> {
  try {
    assertConfig();
    const sortParam = JSON.stringify({ field: "Date", direction: "desc" });
    const response = await fetch(
      `${API_BASE}/${CURATED_TABLE}/records?sort=${encodeURIComponent(sortParam)}&pageSize=1`,
      {
        headers: getHeaders(),
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch curated homepage:", response.status, response.statusText);
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
    assertConfig();
    const sortParam = JSON.stringify({ field: "Date", direction: "desc" });
    const records = await fetchAllRecords<CuratedRecord["fields"]>(
      `${API_BASE}/${CURATED_TABLE}/records?sort=${encodeURIComponent(sortParam)}`,
      getHeaders(),
    );
    return records;
  } catch (error) {
    console.error("Error fetching curated archives:", error);
    return [];
  }
}

export async function fetchNewsArchive(limit = 100): Promise<NewsArticle[]> {
  try {
    assertConfig();
    const sortParam = JSON.stringify({
      field: "Created Date",
      direction: "desc",
    });
    const response = await fetch(
      `${API_BASE}/${NEWS_TABLE}/records?sort=${encodeURIComponent(sortParam)}&pageSize=${limit}`,
      {
        headers: getHeaders(),
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
    // Prefer cached list to avoid per-record 404s during build/export
    if (!newsArticlesCache) {
      newsArticlesCache = await fetchAllNewsArticles();
    }
    const match = newsArticlesCache.find((article) => String(article.id) === String(id));
    return match ?? null;
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    return null;
  }
}

export async function fetchAllNewsArticles(): Promise<NewsArticle[]> {
  try {
    if (newsArticlesCache) {
      return newsArticlesCache;
    }
    assertConfig();
    const sortParam = JSON.stringify({
      field: "Created Date",
      direction: "desc",
    });
    const records = await fetchAllRecords<NewsArticle["fields"]>(
      `${API_BASE}/${NEWS_TABLE}/records?sort=${encodeURIComponent(sortParam)}&pageSize=100`,
      getHeaders(),
    );
    newsArticlesCache = records.map(enrichNewsArticle);
    return newsArticlesCache;
  } catch (error) {
    console.error("Error fetching all news articles:", error);
    return [];
  }
}

export async function fetchStaticContent() {
  const [homepages, articles] = await Promise.all([
    fetchAllCuratedHomepages(),
    fetchAllNewsArticles(),
  ]);

  return {
    curatedHomepages: homepages,
    articles,
  };
}

/**
 * Build-time helper to fetch all archive data and fail fast on missing/invalid results.
 * Used by static generation to avoid silent partial pages.
 */
export async function fetchArchiveData() {
  const { curatedHomepages, articles } = await fetchStaticContent();

  if (!curatedHomepages || curatedHomepages.length === 0) {
    throw new Error("Archive build failed: no curated homepage archives returned.");
  }

  if (!articles || articles.length === 0) {
    throw new Error("Archive build failed: no news articles returned.");
  }

  return { curatedHomepages, articles };
}
