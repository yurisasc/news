import { NextResponse } from "next/server";
import { fetchAllCuratedHomepages } from "@/lib/api";

export async function GET() {
  try {
    const list = await fetchAllCuratedHomepages();

    return NextResponse.json({ list });
  } catch (error) {
    console.error("Error in /api/curated/archive:", error);
    return NextResponse.json({ error: "Failed to fetch curated archives" }, { status: 500 });
  }
}
