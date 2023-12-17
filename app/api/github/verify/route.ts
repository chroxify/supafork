import { verifyRepository } from "@/lib/api/github";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/github/verify
 * Verifies if the repository contains supabase migrations
 * {
 *  repo_url: string,
 * }
 */
export async function GET(req: NextRequest) {
  // Get the repository url
  const repoUrl = await req.nextUrl.searchParams.get("repository_url");

  // Check if the api key is given
  if (!repoUrl) {
    return NextResponse.json(
      { error: "repository_url is missing" },
      { status: 400 },
    );
  }

  // Get the repository full name
  const repoFullName = repoUrl
    .split("/")
    .slice(-2)
    .join("/")
    .replace(".git", "");

  // Verify the repository
  const { repoInfo, migrationsTree, error } =
    await verifyRepository(repoFullName);

  // Check for errors
  if (error !== null || repoInfo === null || migrationsTree === null) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json(
    {
      success: true,
      repo_info: {
        full_name: repoFullName,
        default_branch: repoInfo.default_branch,
      },
      migrationsTree,
    },
    { status: 200 },
  );
}
