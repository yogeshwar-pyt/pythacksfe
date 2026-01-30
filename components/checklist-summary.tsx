"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, MessageSquare, List } from "lucide-react";
import type { EmailInsights } from "@/lib/ai-utils";

interface ChecklistSummaryProps {
  insights: EmailInsights;
}

export function ChecklistSummary({ insights }: ChecklistSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <CardTitle>AI-Generated Checklist</CardTitle>
        </div>
        <CardDescription>
          Actionable insights extracted from debrief email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["verify", "steps", "talking", "risks"]} className="w-full">
          {/* Things to Verify */}
          <AccordionItem value="verify">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">Things to Verify</span>
                <Badge variant="secondary">{insights.checklist.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pl-6">
                {insights.checklist.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                      id={`verify-${index}`}
                    />
                    <label htmlFor={`verify-${index}`} className="cursor-pointer text-sm">
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Step-by-Step Call Flow */}
          <AccordionItem value="steps">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Step-by-Step Call Flow</span>
                <Badge variant="secondary">{insights.callSteps.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="space-y-3 pl-6">
                {insights.callSteps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center rounded-full p-0">
                      {index + 1}
                    </Badge>
                    <span className="text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>

          {/* Important Talking Points */}
          <AccordionItem value="talking">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <span className="font-semibold">Important Talking Points</span>
                <Badge variant="secondary">{insights.talkingPoints.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pl-6">
                {insights.talkingPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-purple-600">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Risks / Missing Information */}
          <AccordionItem value="risks">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-semibold">Risks / Missing Information</span>
                <Badge variant="destructive">{insights.risks.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pl-6">
                {insights.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      {risk}
                    </span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
