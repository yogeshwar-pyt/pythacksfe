"use client";

import { useState, useEffect } from "react";
import { CoachingView } from "@/components/coaching-view";
import { CallAnimation } from "@/components/call-animation";
import { generateCallGuidance, type CallCoachingGuidance } from "@/lib/ai-utils";
import { mockTravelEmail, mockChatHistory } from "@/lib/mock-data";
import { mockBriefingCalls } from "@/lib/mock-calls";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallCoachingPage() {
  const [guidance, setGuidance] = useState<CallCoachingGuidance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callId = searchParams.get("callId");

  const selectedCall = mockBriefingCalls.find((call) => call.id === callId);

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

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleCallComplete = () => {
    setIsCallActive(false);
    // Navigate to analysis page after call completes
    router.push("/call-analysis");
  };

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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Customer Info Header */}
        {selectedCall && (
          <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {selectedCall.customerName}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Booking ID: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedCall.bookingId}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Airport</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedCall.airport}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Call Date</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedCall.callDate}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {guidance && <CoachingView guidance={guidance} onStartCall={handleStartCall} />}
      </div>
      
      {isCallActive && <CallAnimation onComplete={handleCallComplete} />}
    </div>
  );
}
