"use client";

import { useState, useEffect } from "react";
import { CallAnalysisView } from "@/components/call-analysis-view";
import { mockCallAnalysis } from "@/lib/mock-analysis";
import type { CallAnalysis } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function CallAnalysisPage() {
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    const processAnalysis = async () => {
      setIsLoading(true);
      
      // Simulate AI API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysis(mockCallAnalysis);
      setIsLoading(false);
    };

    processAnalysis();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Analyzing call transcript...</p>
          <p className="text-sm text-muted-foreground">Extracting insights and compliance data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {analysis && <CallAnalysisView analysis={analysis} />}
      </div>
    </div>
  );
}
