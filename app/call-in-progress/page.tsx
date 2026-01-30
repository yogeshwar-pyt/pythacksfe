"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Phone, MapPin, Calendar, AlertCircle } from "lucide-react";
import { generateCallGuidance } from "@/lib/ai-utils";
import { mockTravelEmail, mockChatHistory } from "@/lib/mock-data";
import { mockBriefingCalls } from "@/lib/mock-calls";
import { CallAnimation } from "@/components/call-animation";

export default function CallInProgressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callId = searchParams.get("callId");
  const [guidance, setGuidance] = useState<any>(null);
  const [callActive, setCallActive] = useState(false);

  const selectedCall = mockBriefingCalls.find((call) => call.id === callId);

  useEffect(() => {
    const coaching = generateCallGuidance(mockTravelEmail, mockChatHistory);
    setGuidance(coaching);
  }, []);

  const handleStartCall = () => {
    setCallActive(true);
  };

  const handleCallComplete = () => {
    router.push("/call-analysis");
  };

  if (!guidance || !selectedCall) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {selectedCall.customerName}
            </p>
            <p className="text-xs text-slate-500">Booking: {selectedCall.bookingId}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Section 1: Points to Cover - Scrollable (50% width) */}
          <div>
            <div className="sticky top-6 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-850">
              <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Points to Cover
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {guidance.narrative.length} key talking points
                </p>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4">
                <div className="space-y-3">
                  {guidance.narrative.map((point: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750"
                    >
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-700">
                        {index + 1}
                      </div>
                      <p className="flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Call Animation + Chat Summary (50% width) */}
          <div>
            <div className="space-y-6">
              {/* Call Animation */}
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-850">
                <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Call Status
                </h2>
                {!callActive ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-700">
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                      Ready to call {selectedCall.customerName}
                    </p>
                    <button
                      onClick={handleStartCall}
                      className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <Phone className="h-4 w-4" />
                      Start Call
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <CallAnimation onComplete={handleCallComplete} />
                  </div>
                )}
              </div>

              {/* Chat Summary - Moved here */}
              {guidance.chatSummary && (
                <div className="space-y-4">
                  {/* Trip Overview */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-850">
                    <div className="mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Trip Overview
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {guidance.chatSummary.trip_overview}
                    </p>
                  </div>

                  {/* Known Preferences */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-850">
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Known Preferences
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      {guidance.chatSummary.known_preferences.map((pref: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                          • {pref}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Concerns */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-850">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Concerns to Address
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      {guidance.chatSummary.concerns_raised.map((concern: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                          • {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
