"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CallSummaryView } from "@/components/call-summary-view";
import { mockCallAnalysis } from "@/lib/mock-analysis";
import type { CallAnalysis } from "@/lib/types";
import { Loader2 } from "lucide-react";

function CallAnalysisContent() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get data from URL params (passed from call page)
    const checklistDataParam = searchParams.get('checklist');
    
    const processAnalysis = async () => {
      try {
        console.log('[Call Analysis] Starting analysis...');
        console.log('[Call Analysis] Checklist param:', checklistDataParam?.substring(0, 100));
        
        // If we have checklist data from the call, use it
        if (checklistDataParam) {
          try {
            const checklistItems = JSON.parse(decodeURIComponent(checklistDataParam));
            console.log('[Call Analysis] Parsed checklist items:', checklistItems.length);
            
            // Calculate compliance from actual call data
            const totalItems = checklistItems.length;
            const completedItems = checklistItems.filter((item: any) => item.completed);
            const missedItems = checklistItems.filter((item: any) => !item.completed);
            
            console.log('[Call Analysis] Completed:', completedItems.length, 'Missed:', missedItems.length);
            
            const percentage = Math.round((completedItems.length / totalItems) * 100);
            const rating = percentage >= 90 ? "Excellent" : percentage >= 70 ? "Good" : "Needs Improvement";
            
            // Build analysis with real data
            const realAnalysis: CallAnalysis = {
              ...mockCallAnalysis,
              compliance_score: {
                percentage,
                rating,
                total_mandatory_items: totalItems,
                items_conveyed: completedItems.length,
                items_missed: missedItems.length
              },
              conveyed_items: completedItems.map((item: any, idx: number) => ({
                category: "Checklist",
                item: item.text,
                quote: `Mentioned during the call`,
                timestamp: `00:${String(idx * 15).padStart(2, '0')}`
              })),
              missed_items: missedItems.map((item: any) => ({
                category: "Checklist",
                item: item.text,
                importance: "High",
                recommendation: "Include this in follow-up communication"
              }))
            };
            
            console.log('[Call Analysis] Setting analysis data');
            setAnalysis(realAnalysis);
          } catch (error) {
            console.error("Error parsing checklist data:", error);
            setAnalysis(mockCallAnalysis);
          }
        } else {
          console.log('[Call Analysis] No checklist data, using mock');
          // No data from call, use mock
          setAnalysis(mockCallAnalysis);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('[Call Analysis] Error:', error);
        setAnalysis(mockCallAnalysis);
        setIsLoading(false);
      }
    };

    processAnalysis();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-400" />
          <p className="mt-4 text-sm font-medium text-slate-600">Analyzing call transcript...</p>
          <p className="text-xs text-slate-400">Extracting insights and compliance data</p>
        </div>
      </div>
    );
  }

  return analysis ? <CallSummaryView analysis={analysis} /> : null;
}

export default function CallAnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      }
    >
      <CallAnalysisContent />
    </Suspense>
  );
}
