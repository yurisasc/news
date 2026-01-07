import { notFound } from "next/navigation";
import { HomePage } from "@/components/home-page";
import { fetchCuratedHomepage } from "@/lib/api";

export default async function Page() {
  const curated = await fetchCuratedHomepage();

  if (!curated) {
    notFound();
  }

  return <HomePage curatedData={curated} />;
}
