export interface RepoInfo {
  full_name: string;
  default_branch: string;
}

export interface MigrationTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

export interface MigrationTree {
  sha: string;
  url: string;
  tree: MigrationTreeItem[];
  truncated: boolean;
}

export interface VerifyResponse {
  success: boolean;
  repo_info: RepoInfo;
  migrationsTree: MigrationTree;
}
