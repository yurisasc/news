import { NextResponse } from "next/server";
import { fetchCuratedHomepage } from "@/lib/api";

export async function GET() {
  try {
    const data = await fetchCuratedHomepage();

    if (!data) {
      return NextResponse.json({ error: "No curated homepage found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in /api/curated:", error);
    return NextResponse.json({ error: "Failed to fetch curated homepage" }, { status: 500 });
  }
}
