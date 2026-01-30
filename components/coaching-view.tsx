"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, PhoneCall } from "lucide-react";
import type { CallCoachingGuidance } from "@/lib/ai-utils";

interface CoachingViewProps {
  guidance: CallCoachingGuidance;
  onStartCall: () => void;
}

export function CoachingView({ guidance, onStartCall }: CoachingViewProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      {/* Pre-Call Context Summary */}
      {guidance.chatSummary && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Pre-Call Context
            </h2>
          </div>
            
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                Trip Overview
              </h3>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {guidance.chatSummary.trip_overview}
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                Known Preferences
              </h3>
              <ul className="space-y-0.5">
                {guidance.chatSummary.known_preferences.map((pref, idx) => (
                  <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                    • {pref}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                Concerns Raised
              </h3>
              <ul className="space-y-0.5">
                {guidance.chatSummary.concerns_raised.map((concern, idx) => (
                  <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                    • {concern}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Coaching Points */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Call Guidance & Key Points
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Review these points before starting the call
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {guidance.narrative.length} Points
          </Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {guidance.narrative.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800"
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-slate-900 text-xs font-semibold text-white dark:bg-slate-700">
                {index + 1}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Start Call Button */}
      <div className="flex items-center justify-center pt-2">
        <button 
          onClick={onStartCall}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          <PhoneCall className="h-4 w-4" />
          Start Call
        </button>
      </div>
    </div>
  );
}
