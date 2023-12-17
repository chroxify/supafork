import { MigrationTree, RepoInfo } from "../types";

// Verify repository
export async function verifyRepository(repositoryName: string): Promise<{
  repoInfo: RepoInfo | null;
  migrationsTree: MigrationTree | null;
  error: string | null;
}> {
  // Fetch repository info to get the default branch and check if the repository exists
  const repoInfoResponse = await fetch(
    `https://api.github.com/repos/${repositoryName}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  );

  const repoInfo = await repoInfoResponse.json();

  // Check if the repository exists
  if (repoInfo.message !== undefined) {
    return { error: repoInfo.message, repoInfo: null, migrationsTree: null };
  }

  // Fetch repository tree to check if supabase/migrations folder exists
  const repoTreesResponse = await fetch(
    `https://api.github.com/repos/${repositoryName}/git/trees/${repoInfo.default_branch}?recursive=1`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  );

  // Parse the response
  const repoTrees = await repoTreesResponse.json();

  // Check for errors
  if (repoTrees.message !== undefined) {
    return { error: repoTrees.message, repoInfo: null, migrationsTree: null };
  }

  // Verify if supabase/migrations tree exists
  const tree = repoTrees.tree;

  const migrationsTree = tree.find(
    (item: any) => item.path === "supabase/migrations",
  );

  if (!migrationsTree) {
    return {
      error: "supabase/migrations folder is missing",
      repoInfo: null,
      migrationsTree: null,
    };
  }

  // Validate if the migrations folder is empty
  const migrationsTreeContent = await fetch(migrationsTree.url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  const migrationsTreeContentData = await migrationsTreeContent.json();

  if (
    !migrationsTreeContentData ||
    !migrationsTreeContentData.tree ||
    migrationsTreeContentData.tree.length === 0
  ) {
    return {
      error: "supabase/migrations folder is empty",
      repoInfo: null,
      migrationsTree: null,
    };
  }

  // Return the repository info
  return {
    repoInfo: repoInfo,
    migrationsTree: migrationsTreeContentData,
    error: null,
  };
}

// Get repository migrations
export async function getRepositoryMigrations(treeUrl: string): Promise<{
  migrationData: { path: string; content: string; encoding: string }[];
  error: string | null;
}> {
  // Fetch repository tree
  const repoTreesResponse = await fetch(treeUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  const repoTrees = await repoTreesResponse.json();

  // Check if the repository exists
  if (repoTrees.message !== undefined) {
    return { error: repoTrees.message, migrationData: [] };
  }

  // Fetch all blobs from the repository
  const tree = repoTrees.tree;

  // Array to store all migrations scripts
  const migrationData: { path: string; content: string; encoding: string }[] =
    [];

  // Loop through all blobs and fetch the content
  await Promise.all(
    tree.map(async (item: any) => {
      if (item.type !== "blob") return;

      const blobResponse = await fetch(item.url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      });

      const blob = await blobResponse.json();

      // Append blob content to the migrations array
      migrationData.push({
        path: item.path,
        content: blob.content,
        encoding: blob.encoding,
      });
    }),
  );

  // Return the migrations data
  return { migrationData, error: null };
}
