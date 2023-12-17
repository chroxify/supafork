"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState<string[]>([]);
  const [repositoryUrl, setRepositoryUrl] = useState<string>("");

  // Copy value to clipboard
  const copyToClipboard = (key: string, value: string) => {
    setCopied([...copied, key]);

    navigator.clipboard.writeText(value);

    setTimeout(() => {
      setCopied(copied.filter((item) => item !== key));
    }, 3000);
  };

  return (
    <main className="flex w-full flex-col items-center justify-center xl:p-24 bg-background">
      <Card className="w-full h-full bg-card rounded-md max-w-[600px]">
        <CardHeader>
          <CardTitle>Fork Public Supabase Projects</CardTitle>
          <CardDescription>
            Fork a public Supabase project with one click.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-start gap-4">
          {/* Github */}
          <div className="flex flex-col gap-1 w-full">
            <Label>Github Repository URL</Label>
            <Input
              placeholder="https://github.com/username/repository"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
            />
          </div>

          {/* Snippet */}
          <div className="flex flex-col gap-1 w-full">
            <Label>Snippet</Label>

            <Tabs defaultValue="markdown" className="">
              <TabsList className="space-x-5 border-b bg-transparent rounded-none p-0 w-full h-fit justify-start">
                <TabsTrigger
                  value="markdown"
                  className="rounded-none border-b border-transparent px-1 data-[state=active]:border-b data-[state=active]:border-white data-[state=active]:bg-transparent font-light text-muted"
                >
                  Markdown
                </TabsTrigger>
                <TabsTrigger
                  value="html"
                  className="rounded-none border-b border-transparent px-1 data-[state=active]:border-b data-[state=active]:border-white data-[state=active]:bg-transparent font-light"
                >
                  Html
                </TabsTrigger>
                <TabsTrigger
                  value="url"
                  className="rounded-none border-b border-transparent px-1 data-[state=active]:border-b data-[state=active]:border-white data-[state=active]:bg-transparent font-light"
                >
                  Url
                </TabsTrigger>
              </TabsList>
              <TabsContent value="markdown">
                <div className="flex flex-row items-center justify-between h-12 bg-background border rounded-md px-4 font-extralight text-foreground/80">
                  <ScrollArea className="h-fit w-[480px] rounded-md">
                    <div className="flex w-max space-x-4 py-2 text-sm">
                      {`[![Fork Supabase Database](https://supafork.com/button)](https://supafork.com/new`}
                      <p className="font-normal">
                        ?repository_url={encodeURIComponent(repositoryUrl)}
                      </p>
                      {`)`}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>

                  <span
                    className="flex w-10 h-full items-center justify-center -mr-2.5 cursor-pointer"
                    onClick={() =>
                      copyToClipboard(
                        "markdown",
                        `[![Fork Supabase Database](https://supafork.com/button)](https://supafork.com/new?repository_url=${encodeURIComponent(
                          repositoryUrl,
                        )})`,
                      )
                    }
                  >
                    {copied.includes("markdown") ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </span>
                </div>
              </TabsContent>
              <TabsContent value="html">
                <div className="flex flex-row items-center justify-between h-12 bg-background border rounded-md px-4 font-extralight text-foreground/80">
                  <ScrollArea className="h-fit w-[480px] rounded-md">
                    <div className="flex w-max space-x-4 py-2 text-sm">
                      {`<a href="https://supafork.com/new`}
                      <p className="font-normal">
                        ?repository_url={encodeURIComponent(repositoryUrl)}
                      </p>
                      {`"><img src="https://supafork.com/button" alt="Fork Supabase Database"/></a>`}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>

                  <span
                    className="flex w-10 h-full items-center justify-center -mr-2.5 cursor-pointer"
                    onClick={() =>
                      copyToClipboard(
                        "html",
                        `<a href="https://supafork.com/new?repository_url=${encodeURIComponent(
                          repositoryUrl,
                        )}"><img src="https://supafork.com/button" alt="Fork Supabase Database"/></a>`,
                      )
                    }
                  >
                    {copied.includes("html") ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </span>
                </div>
              </TabsContent>
              <TabsContent value="url">
                <div className="flex flex-row items-center justify-between h-12 bg-background border rounded-md px-4 font-extralight text-foreground/80">
                  <ScrollArea className="h-fit w-[480px] rounded-md">
                    <div className="flex w-max space-x-4 py-2 text-sm">
                      {"https://supafork.com/new"}
                      <p className="font-normal">
                        ?repository_url={encodeURIComponent(repositoryUrl)}
                      </p>
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>

                  <span
                    className="flex w-10 h-full items-center justify-center -mr-2.5 cursor-pointer"
                    onClick={() =>
                      copyToClipboard(
                        "url",
                        `https://supafork.com/new?repository_url=${encodeURIComponent(
                          repositoryUrl,
                        )}`,
                      )
                    }
                  >
                    {copied.includes("url") ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </span>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Button Example */}
          <div className="flex flex-col w-full items-center justify-center">
            <Link
              href={`https://supafork.com/new?repository_url=${encodeURIComponent(
                repositoryUrl,
              )}`}
            >
              <Image src="/button.svg" alt="Button" width={150} height={20} />
            </Link>
            <p className="text-sm font-extralight text-foreground/50 mt-2">
              An example Fork button using the snippet above
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
