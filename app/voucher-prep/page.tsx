"use client";

import { useState, useEffect } from "react";
import { CoachingView } from "@/components/coaching-view";
import { generateCallGuidance, type CallCoachingGuidance } from "@/lib/ai-utils";
import { mockTravelEmail, mockChatHistory } from "@/lib/mock-data";
import { Loader2 } from "lucide-react";

export default function CallCoachingPage() {
  const [guidance, setGuidance] = useState<CallCoachingGuidance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    const processContext = async () => {
      setIsLoading(true);
      
      // Simulate AI API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate coaching guidance from email and chat (never displayed)
      const coaching = generateCallGuidance(mockTravelEmail, mockChatHistory);
      
      setGuidance(coaching);
      setIsLoading(false);
    };

    processContext();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Generating call guidance...</p>
          <p className="text-sm text-muted-foreground">Processing context</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {guidance && <CoachingView guidance={guidance} onStartCall={() => {}} />}
      </div>
    </div>
  );
}
