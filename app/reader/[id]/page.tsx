import { ReaderPageClient } from "@/components/reader-page-client";

interface ReaderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { id } = await params;

  return <ReaderPageClient id={id} />;
}
