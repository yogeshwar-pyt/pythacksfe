"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, CheckCircle, Clock, AlertCircle, ArrowUpCircle } from "lucide-react";
import type { ChatSummary } from "@/lib/ai-utils";

interface ChatSummaryProps {
  summary: ChatSummary;
}

export function ChatSummaryComponent({ summary }: ChatSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <CardTitle>Chat History Summary</CardTitle>
        </div>
        <CardDescription>
          Key insights and action items from team discussions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full">
          <div className="space-y-6">
            {/* Key Decisions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-lg">Key Decisions</h3>
                <Badge variant="secondary">{summary.decisions.length}</Badge>
              </div>
              <ul className="space-y-2 pl-7">
                {summary.decisions.map((decision, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-green-600">✓</span>
                    <span className="leading-relaxed">{decision}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pending Questions */}
            {summary.pendingItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">Pending Items</h3>
                  <Badge variant="outline" className="bg-orange-50">
                    {summary.pendingItems.length}
                  </Badge>
                </div>
                <ul className="space-y-2 pl-7">
                  {summary.pendingItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confirmations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Confirmations</h3>
                <Badge variant="secondary">{summary.confirmations.length}</Badge>
              </div>
              <ul className="space-y-2 pl-7">
                {summary.confirmations.map((confirmation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-blue-600">◆</span>
                    <span className="leading-relaxed">{confirmation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Escalations (if any) */}
            {summary.escalations && summary.escalations.length > 0 && (
              <div className="space-y-3 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-2">
                  <ArrowUpCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-lg text-red-900">Escalations</h3>
                  <Badge variant="destructive">{summary.escalations.length}</Badge>
                </div>
                <ul className="space-y-2 pl-7">
                  {summary.escalations.map((escalation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <span className="font-medium leading-relaxed text-red-900">{escalation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
