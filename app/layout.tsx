import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Supafork",
  description: "Fork public Supabase projects with one click",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Toaster closeButton />
      <Analytics />
      {process.env.NODE_ENV === "production" && (
          <Script
            src="https://cdn.seline.so/seline.js"
            data-token="4ebea903a1d4d1c"
            async
          />
      )}
      <body
        className={cn(
          GeistSans.className,
          "bg-background flex min-h-screen w-full flex-col items-center justify-between selection:bg-[#6EE7B7] selection:text-background",
        )}
      >
        {/* Header */}
        <header className="top-0 left-0 right-0 flex flex-row items-center justify-between w-full h-24 bg-background max-w-screen-2xl mx-auto px-2 sm:px-5">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={150} height={40} />
          </Link>
          <Link
            href="https://github.com/chroxify/supafork"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="h-[34px]">Star on GitHub</Button>
          </Link>
        </header>

        {/* Main */}
        {children}

        {/* Footer */}
        <footer className="bottom-0 left-0 right-0 flex flex-col items-center justify-center w-full h-24 bg-background">
          <p className="text-sm font-light text-muted">
            Made by{" "}
            <Link
              href="https://twitter.com/0xChroxify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Christo
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
