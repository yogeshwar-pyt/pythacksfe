"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Clock } from "lucide-react";

interface ChatMessage {
  sender: string;
  content: string;
  timestamp?: string;
}

interface CallFlowStepsProps {
  messages: ChatMessage[];
}

export function CallFlowSteps({ messages }: CallFlowStepsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>Team Chat History</CardTitle>
        </div>
        <CardDescription>
          Internal communications and coordination
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${
                  message.sender === "System"
                    ? "border-blue-200 bg-blue-50"
                    : message.sender.includes("Supervisor")
                    ? "border-purple-200 bg-purple-50"
                    : "bg-white"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">{message.sender}</span>
                    {message.sender.includes("Supervisor") && (
                      <Badge variant="secondary" className="text-xs">
                        Manager
                      </Badge>
                    )}
                    {message.sender === "System" && (
                      <Badge variant="outline" className="text-xs">
                        Auto
                      </Badge>
                    )}
                  </div>
                  {message.timestamp && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{message.timestamp}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{message.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
