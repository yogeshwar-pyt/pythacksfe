"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, AlertTriangle, ListTodo, TrendingUp, Clock, ArrowLeft } from "lucide-react";
import type { CallAnalysis } from "@/lib/types";
import Link from "next/link";

interface CallAnalysisViewProps {
  analysis: CallAnalysis;
}

export function CallAnalysisView({ analysis }: CallAnalysisViewProps) {
  const complianceColor = 
    analysis.compliance_score.percentage >= 90 ? "text-green-600" :
    analysis.compliance_score.percentage >= 70 ? "text-orange-600" :
    "text-red-600";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/ao-dashboard">
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Call Analysis Report</h1>
            <p className="text-xs text-slate-500">{analysis.timestamp}</p>
          </div>
        </div>
        <Badge className="text-xs" variant="secondary">
          {analysis.processing_time_seconds}s
        </Badge>
      </div>

      {/* Compliance Score - Hero Section */}
      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-850">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Compliance Score</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-4xl font-semibold ${complianceColor}`}>
                  {analysis.compliance_score.percentage}%
                </span>
                <span className="text-sm text-slate-500">
                  {analysis.compliance_score.items_conveyed}/{analysis.compliance_score.total_mandatory_items} items
                </span>
              </div>
              <Badge className="mt-2" variant="outline">
                {analysis.compliance_score.rating}
              </Badge>
            </div>
            <div className="text-right">
              <div className="mb-1 text-xs font-medium text-slate-500">Call Quality</div>
              <div className="text-lg font-semibold">{analysis.insights.call_quality}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {analysis.insights.customer_sentiment} Sentiment
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Conveyed Items */}
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-850">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <CardTitle className="text-sm font-semibold">Successfully Conveyed</CardTitle>
              <Badge variant="secondary" className="text-xs">{analysis.conveyed_items.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-3">
              <div className="space-y-2">
                {analysis.conveyed_items.map((item, index) => (
                  <div key={index} className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30">
                    <div className="mb-1 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <p className="mb-1 text-xs font-medium">{item.item}</p>
                    <p className="text-xs italic text-slate-600 dark:text-slate-400">"{item.quote}"</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Missed Items */}
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-850">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <CardTitle className="text-sm font-semibold">Missed Items</CardTitle>
              <Badge variant="destructive" className="text-xs">{analysis.missed_items.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-3">
              <div className="space-y-2">
                {analysis.missed_items.map((item, index) => (
                  <div key={index} className="rounded-md border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950/30">
                    <div className="mb-1 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge 
                        variant={item.importance === "High" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {item.importance}
                      </Badge>
                    </div>
                    <p className="mb-1 text-xs font-medium">{item.item}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.recommendation}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Tasks */}
      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-850">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ListTodo className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-semibold">Action Items</CardTitle>
            <Badge variant="secondary" className="text-xs">{analysis.tasks.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {analysis.tasks.map((task, index) => (
              <div key={index} className="rounded-md border border-slate-200 p-3 dark:border-slate-700">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={task.owner === "Agent" ? "default" : "secondary"} className="text-xs">
                    {task.owner}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {task.deadline}
                  </div>
                </div>
                <p className="mb-1 text-xs font-semibold">{task.task}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{task.context}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-850">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <CardTitle className="text-sm font-semibold">Call Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">Overall Summary</p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {analysis.insights.overall_summary}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="mb-1.5 text-xs font-semibold text-green-600\">Positive Highlights</p>
                <ul className="space-y-1">
                  {analysis.insights.positive_highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      <span className="text-slate-700 dark:text-slate-300">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold text-orange-600">Areas of Concern</p>
                <ul className="space-y-1">
                  {analysis.insights.areas_of_concern.map((concern, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-600" />
                      <span className="text-slate-700 dark:text-slate-300">{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-semibold">Performance: </span>
                {analysis.insights.salesperson_performance}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
