"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneCall, X, MapPin, Calendar, AlertCircle } from "lucide-react";
import type { CallCoachingGuidance } from "@/lib/ai-utils";

interface PreCallModalProps {
  open: boolean;
  onClose: () => void;
  guidance: CallCoachingGuidance;
  onStartCall: () => void;
  customerName: string;
}

export function PreCallModal({ 
  open, 
  onClose, 
  guidance, 
  onStartCall,
  customerName 
}: PreCallModalProps) {
  // Split narrative into groups for better organization
  const midPoint = Math.ceil(guidance.narrative.length / 3);
  const group1 = guidance.narrative.slice(0, midPoint);
  const group2 = guidance.narrative.slice(midPoint, midPoint * 2);
  const group3 = guidance.narrative.slice(midPoint * 2);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-[95vw] lg:max-w-7xl overflow-hidden p-0">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Pre-Call Briefing
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {customerName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content - 3 Column Layout, All Visible */}
        <div className="bg-slate-50 px-6 py-4 dark:bg-slate-900">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Column 1: Trip Context */}
            <div className="space-y-3">
              {guidance.chatSummary && (
                <>
                  {/* Trip Overview */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-850">
                    <div className="mb-2 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                        Trip Overview
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {guidance.chatSummary.trip_overview}
                    </p>
                  </div>

                  {/* Known Preferences */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-850">
                    <div className="mb-2 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                        Known Preferences
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      {guidance.chatSummary.known_preferences.map((pref, idx) => (
                        <li key={idx} className="text-xs leading-snug text-slate-700 dark:text-slate-300">
                          • {pref}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Concerns */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-850">
                    <div className="mb-2 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                        Concerns to Address
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      {guidance.chatSummary.concerns_raised.map((concern, idx) => (
                        <li key={idx} className="text-xs leading-snug text-slate-700 dark:text-slate-300">
                          • {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Column 2: Key Points (First Half) */}
            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-850">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                  Key Talking Points
                </h3>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                  {guidance.narrative.length} Total
                </Badge>
              </div>
              <div className="space-y-2">
                {group1.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-slate-900 text-[10px] font-semibold text-white dark:bg-slate-700">
                      {index + 1}
                    </div>
                    <p className="flex-1 text-xs leading-snug text-slate-700 dark:text-slate-300">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Key Points (Second Half) */}
            <div className="space-y-2">
              {group2.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-850"
                >
                  <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-slate-900 text-[10px] font-semibold text-white dark:bg-slate-700">
                    {midPoint + index + 1}
                  </div>
                  <p className="flex-1 text-xs leading-snug text-slate-700 dark:text-slate-300">
                    {point}
                  </p>
                </div>
              ))}
              {group3.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-850"
                >
                  <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-slate-900 text-[10px] font-semibold text-white dark:bg-slate-700">
                    {midPoint * 2 + index + 1}
                  </div>
                  <p className="flex-1 text-xs leading-snug text-slate-700 dark:text-slate-300">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Start Call Button */}
        <div className="border-t border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={onStartCall}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <PhoneCall className="h-4 w-4" />
              Start Call
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
