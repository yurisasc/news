import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NewsSearch } from "@/components/news-search";
import { fetchArchiveData } from "@/lib/api";
import { generateNewsPageNumbers, NEWS_PAGE_SIZE } from "@/lib/archive";

type NewsPageParams = { page: string };
type NewsPageProps = { params: NewsPageParams | Promise<NewsPageParams> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const { articles } = await fetchArchiveData();
  const pageNumbers = generateNewsPageNumbers(articles.length, NEWS_PAGE_SIZE);
  return pageNumbers.map((page) => ({ page: String(page) }));
}

export async function generateMetadata({ params }: { params: NewsPageParams }): Promise<Metadata> {
  const { page } = params;
  return {
    title: `News Archive – Page ${page}`,
    description: `Browse news articles in the Obluda archive, page ${page}.`,
  };
}

export default async function NewsArchivePageRoute({ params }: NewsPageProps) {
  const resolvedParams = await params;
  const pageStr = resolvedParams?.page;
  const page = Number(pageStr);

  if (!pageStr || Number.isNaN(page) || page < 1) {
    notFound();
  }

  const { articles } = await fetchArchiveData();
  const totalPages = Math.ceil(articles.length / NEWS_PAGE_SIZE);

  if (page > totalPages) {
    notFound();
  }

  return articles.length > 0 ? (
    <Suspense fallback={<div className="text-muted-foreground">Loading news...</div>}>
      <NewsSearch initialData={articles} initialPage={page} />
    </Suspense>
  ) : (
    <p className="text-muted-foreground">No news records available.</p>
  );
}
