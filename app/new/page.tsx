"use client";

import InstructionCards from "@/components/instruction-cards";
import { fetcher } from "@/lib/utils";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { VerifyResponse } from "@/lib/types";
import InfoPanel from "@/components/info-panel";

export default function New({
  searchParams: { repository_url: repositoryUrl },
}: {
  searchParams: { repository_url: string };
}) {
  const [step, setStep] = useState<number>(0);

  if (repositoryUrl === undefined) {
    redirect("/");
  }

  const { data, error, isLoading } = useSWR<VerifyResponse>(
    `/api/github/verify?repository_url=${repositoryUrl}`,
    fetcher,
  );

  useEffect(() => {
    if (error) {
      const errorObject = JSON.parse(error.message);
      toast.error(errorObject.error);
      redirect("/");
    }
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center w-full p-10 lg:p-5 lg:max-w-screen-2xl">
      <div className="flex flex-row items-star justify-center w-full h-full gap-5">
        {/* Info Panel */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/3 min-h-max h-full">
          <InfoPanel
            step={step}
            setStep={setStep}
            repositoryUrl={repositoryUrl}
            data={data}
            isLoading={isLoading}
          />
        </div>

        {/* Instructions */}
        <div className="flex flex-col items-center justify-center w-full md:w-2/3 min-h-max h-full gap-5">
          <InstructionCards
            step={step}
            setStep={setStep}
            migrationTree={data?.migrationsTree}
          />
        </div>
      </div>
    </main>
  );
}
