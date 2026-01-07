import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveHomepageView } from "@/components/archive/archive-homepage-view";
import { fetchArchiveData } from "@/lib/api";

type HomepageParams = { date: string };
type HomepagePageProps = { params: HomepageParams | Promise<HomepageParams> };

export const dynamicParams = false;

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const { curatedHomepages } = await fetchArchiveData();
  return curatedHomepages.map((record) => ({ date: record.fields.Date }));
}

export async function generateMetadata({ params }: { params: HomepageParams }): Promise<Metadata> {
  const { date } = params;
  return {
    title: `Homepage Archive – ${formatDateLabel(date)}`,
    description: `Archived Obluda homepage for ${formatDateLabel(date)}.`,
  };
}

export default async function HomepageArchiveDatePage({ params }: HomepagePageProps) {
  const resolvedParams = await params;
  const date = resolvedParams?.date;
  const { curatedHomepages } = await fetchArchiveData();
  const match = curatedHomepages.find((record) => record.fields.Date === date);

  if (!date || !match) {
    notFound();
  }

  return <ArchiveHomepageView archive={match} backHref="/archive/homepage" />;
}
