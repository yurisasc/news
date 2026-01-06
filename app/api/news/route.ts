import { type NextRequest, NextResponse } from "next/server";
import { fetchNewsArchive } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const list = await fetchNewsArchive(limit);

    return NextResponse.json({ list });
  } catch (error) {
    console.error("Error in /api/news:", error);
    return NextResponse.json({ error: "Failed to fetch news archive" }, { status: 500 });
  }
}
