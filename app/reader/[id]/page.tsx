import { notFound } from "next/navigation";
import { ReaderPageClient } from "@/components/reader/reader-page-client";
import { fetchAllNewsArticles, fetchNewsById } from "@/lib/api";

type ReaderPageParams = { id: string };
type ReaderPageProps = { params: ReaderPageParams | Promise<ReaderPageParams> };

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const articles = await fetchAllNewsArticles();
    const params = articles.map((article) => ({
      id: String(article.id),
    }));
    return params;
  } catch {
    return [];
  }
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const article = await fetchNewsById(id);

  if (!article) {
    notFound();
  }

  return <ReaderPageClient id={id} initialArticle={article} />;
}
