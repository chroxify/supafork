"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InfoCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Icons } from "./icons";
import { MigrationTree } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

export default function InstructionCards({
  step,
  setStep,
  migrationTree,
}: {
  step: number;
  setStep: Function;
  migrationTree: MigrationTree | undefined;
}) {
  const [isLoading, setIsLoading] = useState<"connect" | "fork" | false>(false);
  const [connectionString, setConnectionString] = useState("");
  const [migrations, setMigrations] = useState<string[]>(
    migrationTree?.tree.map((migration) => migration.path) || [],
  );

  async function connectProject() {
    if (!connectionString || connectionString.includes("[YOUR-PASSWORD]")) {
      return toast.error(
        !connectionString
          ? "Database connection string is missing."
          : "Please replace [YOUR-PASSWORD] with your database password.",
      );
    }

    setIsLoading("connect");

    // Verify database credentials
    const res = await fetch("/api/supabase/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: connectionString,
      }),
    });

    setIsLoading(false);

    if (res.status !== 200) {
      return toast.error("Invalid database credentials.");
    }

    setStep(2);
  }

  async function forkProject() {
    if (migrations.length === 0) {
      return toast.error("No migrations selected.");
    }

    setIsLoading("fork");

    // Fetch migrations data
    const fetchMigrationsResponse = await fetch(
      `/api/github?tree_url=${migrationTree?.url}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (fetchMigrationsResponse.status !== 200) {
      return toast.error("Failed to fetch migrations data.");
    }

    const migrationsData = await fetchMigrationsResponse.json();

    // Migrate migrations
    const migrateResponse = await fetch(`/api/supabase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: connectionString,
        migrations: migrations.map((migration) =>
          migrationsData.find((m: any) => m.path === migration),
        ),
      }),
    });

    if (migrateResponse.status !== 200) {
      return toast.error("Failed to migrate migrations.");
    }

    setIsLoading(false);

    setStep(3);

    toast.success("Successfully forked project! Redirecting to dashboard...");

    setTimeout(() => {
      window.location.href = `https://supabase.com/dashboard/project/${
        connectionString.split("postgres.")[1].split(":")[0]
      }`;
    }, 2500);
  }

  useEffect(() => {
    if (migrationTree) {
      setMigrations(migrationTree.tree.map((migration) => migration.path));
    }
  }, [migrationTree]);

  return (
    <>
      {/* Create Project */}
      <Card className="w-full h-full bg-card rounded-md">
        <CardHeader>
          <CardTitle>Create new Project</CardTitle>
          <CardDescription>
            Create a new Supabase project or use an already existing one.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Button
            className="w-full"
            onClick={() => {
              setStep(1);
            }}
            disabled={step !== 0}
          >
            I want to use an existing project
          </Button>
          <Link
            href="https://supabase.com/dashboard/new/_"
            className={cn(step !== 0 && "pointer-events-none", "w-full")}
            aria-disabled={step !== 0}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="w-full"
              onClick={() => setStep(1)}
              disabled={step !== 0}
            >
              Create new Project
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="w-full h-full bg-card rounded-md">
        <CardHeader>
          <CardTitle>Connect Project</CardTitle>
          <CardDescription>
            Connect your Supabase database to Supafork
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex flex-col space-y-1 w-full">
              <div className="flex flex-row items-center gap-2">
                <Label>Database Connection String</Label>
                <TooltipProvider delayDuration={250}>
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionMarkCircledIcon className="w-4 h-4 text-foreground/60" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <>
                        The connection string to your Supabase database. You can
                        find this in your{" "}
                        <Link
                          href="https://supabase.com/dashboard/project/_/settings/database"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium"
                        >
                          database settings
                        </Link>{" "}
                        in the Supabase dashboard.
                      </>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                className="w-full"
                placeholder="postgres://postgres.[ref]:[password]@[cloud]-0-[region].pooler.supabase.com:5432/postgres"
                onChange={(e) => {
                  setConnectionString(e.target.value);
                }}
                disabled={step !== 1}
              />
            </div>
          </div>

          {/* Note Box */}
          <div className="bg-red-500/[15%] border border-red-500/50 p-4 rounded-md space-y-2">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <InfoCircledIcon className="w-6 h-6 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm text-red-400">
                  We never store your database credentials!
                </h3>
                <div className="mt-2 text-sm font-light text-red-400/80">
                  <p className="text-sm font-light text-red-400/80">
                    Your database credentials are only used to verify your
                    database connection and to migrate the migrations you
                    select. We never store your database credentials. Feel free
                    to check out the{" "}
                    <Link
                      href="https://github.com/chroxify/supafork"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline"
                    >
                      source code
                    </Link>{" "}
                    to verify this.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={step !== 1 || isLoading === "connect"}
            onClick={connectProject}
          >
            {isLoading === "connect" && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Connect Project
          </Button>
        </CardFooter>
      </Card>

      {/* Fork */}
      <Card className="w-full h-full bg-card rounded-md">
        <CardHeader>
          <CardTitle>Fork Project</CardTitle>
          <CardDescription>
            Fork repository migrations to your connected Supabase project
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Accordion type="single" collapsible>
            <AccordionItem
              value="item-1"
              className="border-b-0 border bg-background rounded-md px-5"
            >
              <AccordionTrigger className="hover:no-underline font-light text-foreground/80 py-3">
                Project Migrations
              </AccordionTrigger>
              <AccordionContent>
                {migrationTree ? (
                  <div className="flex flex-col gap-2">
                    {migrationTree.tree.map((migration) => (
                      <div
                        className="flex flex-row items-center gap-2"
                        key={migration.path}
                      >
                        <Checkbox
                          id={migration.path}
                          checked={migrations.includes(migration.path)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setMigrations([...migrations, migration.path]);
                            } else {
                              setMigrations(
                                migrations.filter((m) => m !== migration.path),
                              );
                            }
                          }}
                        />
                        <span
                          className={cn(
                            "flex flex-1 text-sm font-light text-foreground transition-all",
                            !migrations.includes(migration.path)
                              ? "line-through text-muted"
                              : "",
                          )}
                        >
                          {migration.path}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Skeleton className="w-full h-5" />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={
              step !== 2 || migrations.length === 0 || isLoading === "fork"
            }
            onClick={forkProject}
          >
            {isLoading === "fork" && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Fork Project
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
