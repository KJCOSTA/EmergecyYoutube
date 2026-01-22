"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import GuidelinesModal from "@/components/GuidelinesModal";
import ApiKeysModal from "@/components/ApiKeysModal";
import { useWorkflowStore } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const { currentStep } = useWorkflowStore();

  useEffect(() => {
    // Redirect to current step
    const stepPaths: Record<number, string> = {
      1: "/step/1-input",
      2: "/step/2-research",
      4: "/step/4-proposal",
      5: "/step/5-studio",
      6: "/step/6-upload",
    };
    router.push(stepPaths[currentStep] || "/step/1-input");
  }, [currentStep, router]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
      <GuidelinesModal />
      <ApiKeysModal />
    </Layout>
  );
}
