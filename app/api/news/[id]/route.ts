import { type NextRequest, NextResponse } from "next/server";
import { fetchNewsById } from "@/lib/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const article = await fetchNewsById(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ data: article });
  } catch (error) {
    console.error("Error in /api/news/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
