import ArchivePageClient from "@/components/archive-page-client";
import { fetchAllCuratedHomepages, fetchAllNewsArticles } from "@/lib/api";

export default async function ArchivePage() {
  const [curatedArchive, newsArchive] = await Promise.all([
    fetchAllCuratedHomepages(),
    fetchAllNewsArticles(),
  ]);

  return <ArchivePageClient curatedArchive={curatedArchive} newsArchive={newsArchive} />;
}
