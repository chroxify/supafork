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
  EyeClosedIcon,
  EyeOpenIcon,
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
  const [showPassword, setShowPassword] = useState(false);
  const [project, setProject] = useState<{
    ref: string | null;
    password: string | null;
  }>({ ref: null, password: null });
  const [migrations, setMigrations] = useState<string[]>(
    migrationTree?.tree.map((migration) => migration.path) || [],
  );

  async function connectProject() {
    if (!project.ref || !project.password) {
      return toast.error(
        `${
          !project.ref ? "Project Reference ID" : "Database Password"
        } is missing.`,
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
        url: `postgresql://postgres:${project.password}@db.${project.ref}.supabase.co:5432/postgres`,
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
        url: `postgresql://postgres:${project.password}@db.${project.ref}.supabase.co:5432/postgres`,
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
      window.location.href = `https://supabase.com/dashboard/project/${project.ref}`;
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
          <CardDescription>Create a new project to fork into</CardDescription>
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
          <CardDescription>Connect a database to your project</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex flex-col space-y-1 w-full">
              <div className="flex flex-row items-center gap-2">
                <Label>Project Reference ID</Label>
                <TooltipProvider delayDuration={250}>
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionMarkCircledIcon className="w-4 h-4 text-foreground/60" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <>
                        This is the reference ID of your Supabase project. (Can
                        be found in the URL of your Supabase dashboard)
                      </>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                className="w-full"
                placeholder="Reference ID"
                onChange={(e) => {
                  setProject({ ...project, ref: e.target.value });
                }}
                disabled={step !== 1}
              />
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <div className="flex flex-row items-center gap-2">
                <Label>Database Password</Label>
                <TooltipProvider delayDuration={250}>
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionMarkCircledIcon className="w-4 h-4 text-foreground/60" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        This is the password you set when you created your
                        Supabase project.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div
                className={cn(
                  "bg-background focus-within:ring-ring ring-offset-background flex h-9 w-full rounded-md border text-sm font-extralight transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 ring-offset-1",
                  step !== 1 && "opacity-50",
                )}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100",
                    !showPassword &&
                      project.password?.length &&
                      "font-black tracking-[0.12rem]",
                  )}
                  placeholder="Database Password"
                  onChange={(e) => {
                    setProject({ ...project, password: e.target.value });
                  }}
                  disabled={step !== 1}
                />
                <div
                  className={cn(
                    "flex items-center justify-center text-foreground/50 select-none rounded-r-md px-3 py-2 cursor-pointer",
                    step !== 1 && "cursor-not-allowed",
                  )}
                  onClick={() => {
                    step === 1 && setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? (
                    <EyeOpenIcon className="w-4 h-4" />
                  ) : (
                    <EyeClosedIcon className="w-4 h-4" />
                  )}
                </div>
              </div>
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
          <CardDescription>Fork migrations to your project</CardDescription>
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
                      <div className="flex flex-row items-center gap-2">
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
