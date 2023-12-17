import { getRepositoryMigrations } from "@/lib/api/github";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get migrations from the repository
 */
export async function GET(req: NextRequest) {
  // Get the repository url
  const treeUrl = await req.nextUrl.searchParams.get("tree_url");

  // Check if the
  if (!treeUrl) {
    return NextResponse.json({ error: "repo_url is missing" }, { status: 400 });
  }

  // Fetch repository migrations
  const { migrationData, error } = await getRepositoryMigrations(treeUrl);

  // Check for errors
  if (error !== null) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // Return the migrations data
  return NextResponse.json(migrationData);
}
