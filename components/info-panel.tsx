import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DatabaseBackup, ExternalLink, GitBranch } from "lucide-react";
import Link from "next/link";
import { VerifyResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function InfoPanel({
  step,
  setStep,
  repositoryUrl,
  data,
  isLoading,
}: {
  step: number;
  setStep: any;
  repositoryUrl: string;
  data: VerifyResponse | undefined;
  isLoading: boolean;
}) {
  return (
    <>
      <div className="flex flex-row items-center justify-start w-full h-24 rounded-md bg-card gap-3 px-8 border">
        <Icons.Github className="w-8 h-8" />
        {!isLoading ? (
          <p className="text-lg font-light">
            {data?.repo_info.full_name.split("/")[1]}
          </p>
        ) : (
          <Skeleton className="w-32 h-6" />
        )}
      </div>

      <Separator className="my-6 w-full" />

      <div className="relative flex-col items-center justify-center w-full h-full rounded-md ml-8">
        <div
          className={cn(
            "flex flex-col items-start w-full h-12 border-l",
            step >= 1 ? "border-white" : "border-muted",
          )}
        >
          <span
            className={cn(
              "absolute flex items-center justify-center w-[11px] h-[11px] rounded-full -start-[5px]",
              step >= 0 ? "bg-foreground" : "bg-muted",
            )}
          />
          <p
            className={cn(
              "flex text-sm font-light -mt-1 pl-5",
              step >= 0 ? "text-foreground" : "text-muted",
            )}
          >
            Create new Project
          </p>
        </div>
        <div
          className={cn(
            "flex flex-col items-start w-full h-12  border-l",
            step >= 2 ? "border-white" : "border-muted",
          )}
        >
          <span
            className={cn(
              "absolute flex w-[11px] h-[11px] rounded-full -start-[5px]",
              step >= 1 ? "bg-foreground" : "bg-muted",
            )}
          />
          <p
            className={cn(
              "flex text-sm font-light -mt-1 pl-5",
              step >= 1 ? "text-foreground" : "text-muted",
            )}
          >
            Connect Project
          </p>
        </div>
        <div className="flex flex-col items-start w-full h-fit">
          <span
            className={cn(
              "absolute flex w-[11px] h-[11px] rounded-full -start-[5px]",
              step >= 2 ? "bg-foreground" : "bg-muted",
            )}
          />
          <p
            className={cn(
              "flex text-sm font-light -mt-1 pl-5",
              step >= 2 ? "text-foreground" : "text-muted",
            )}
          >
            Fork Project
          </p>
        </div>
      </div>

      <Separator className="my-6 w-full" />

      <div className="flex flex-col w-full h-full rounded-md ml-8 gap-3">
        <span className="flex text-sm text-muted font-light">
          GIT REPOSITORY
        </span>

        {/* Repository Name */}
        <Link
          className="flex flex-row w-full gap-2"
          href={repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.Github className="w-5 h-5" />
          <span className="flex flex-1 text-sm font-light text-foreground">
            {!isLoading ? (
              data?.repo_info.full_name
            ) : (
              <Skeleton className="w-24 h-5" />
            )}
          </span>
        </Link>

        {/* Branch */}
        <Link
          className="flex flex-row w-full gap-2 text-sm font-light text-foreground/50"
          href={`https://github.com/${data?.repo_info.full_name}/tree/${data?.repo_info.default_branch}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitBranch className="w-5 h-5" />
          {!isLoading ? (
            data?.repo_info.default_branch
          ) : (
            <Skeleton className="w-24 h-5" />
          )}
        </Link>

        {/* Migrations */}
        <Link
          className="flex flex-row w-full gap-2 text-sm font-light text-foreground/50"
          href={`https://github.com/${data?.repo_info.full_name}/tree/${data?.repo_info.default_branch}/supabase/migrations`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DatabaseBackup className="w-5 h-5" />
          {!isLoading ? (
            `${data?.migrationsTree.tree.length} Migrations`
          ) : (
            <Skeleton className="w-24 h-5" />
          )}
        </Link>
      </div>

      <Separator className="my-6 w-full" />

      <div className="flex flex-col w-full h-full rounded-md gap-3 ml-8">
        <Link
          className="flex flex-row items-center w-full h-full text-sm rounded-md text-foreground/50 font-light hover:text-foreground/90 transition-all"
          href="https://github.com/chroxify/supafork"
          target="_blank"
          rel="noopener noreferrer"
        >
          Star on GitHub
          <ExternalLink className="w-4 h-4 ml-2" />
        </Link>

        <Link
          className="flex flex-row items-center w-full h-full text-sm rounded-md text-foreground/50 font-light hover:text-foreground/90 transition-all"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Import different repository
          <ExternalLink className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </>
  );
}
