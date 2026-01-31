"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  TrendingUp,
  MessageSquare,
  Target,
  Zap,
} from "lucide-react";
import type { CallAnalysis } from "@/lib/types";
import Link from "next/link";

// Actual diarized conversation from sales call
const DIARIZED_CONVERSATION = [
  { time: "0:00", speaker: "agent", text: "Hello, good afternoon sir, Ravi this side calling from PickYourTrail." },
  { time: "0:05", speaker: "agent", text: "Actually sir, I have received an enquiry of yours regarding a Dubai vacation." },
  { time: "0:11", speaker: "customer", text: "Are you planning one?" },
  { time: "0:12", speaker: "customer", text: "Yes sir, yes sir, I am planning." },
  { time: "0:15", speaker: "customer", text: "So is it a good time to speak with you regarding the same right now?" },
  { time: "0:20", speaker: "agent", text: "Yes sir, yes sir." },
  { time: "0:21", speaker: "agent", text: "Sir, can you tell me your travel dates please?" },
  { time: "0:24", speaker: "customer", text: "Sir, I am, one second, I am planning for April 21st." },
  { time: "0:28", speaker: "agent", text: "May means April 31st returns like 9 nights 10 days." },
  { time: "0:32", speaker: "agent", text: "Okay for 9 nights 10 days you are planning and sir how many people will be travelling with you?" },
  { time: "0:38", speaker: "customer", text: "Couple and a small baby. Baby means she is 4 years." },
  { time: "0:43", speaker: "agent", text: "Notice 2 adults and 1 child that will be." },
  { time: "0:46", speaker: "customer", text: "Yes sir." },
  { time: "0:47", speaker: "agent", text: "And sir like what are you like travelling for some special occasion or just a normal summer vacation?" },
  { time: "0:54", speaker: "customer", text: "No sir actually it's my anniversary on 25th." },
  { time: "0:58", speaker: "customer", text: "25th of your anniversary wow congratulations sir thank you sir for that means vacation also in that occasion also ok noted noted..." },
  { time: "1:27", speaker: "agent", text: "Bangalore okay perfect sir you can find a really good flights from there..." },
  { time: "1:53", speaker: "customer", text: "Can I tell you what all I need, sir." },
  { time: "1:55", speaker: "agent", text: "Sure, yes. Please, sure, sir. Go ahead. I'll make a note of everything." },
  { time: "2:00", speaker: "customer", text: "First, I want to land in Abu Dhabi, sir." },
  { time: "2:04", speaker: "agent", text: "Okay. Noted, sir." },
  { time: "2:05", speaker: "customer", text: "And I want three days in that Yas Island. I want to stay there only." },
  { time: "2:10", speaker: "agent", text: "Noted, sir." },
  { time: "2:14", speaker: "customer", text: "And I want all the passes for Ferrari World, Warner Bros, Sea World..." },
  { time: "2:22", speaker: "agent", text: "Sea World, Ferrari, that is there no? Yes sir. And one more, Warner Brothers." },
  { time: "2:28", speaker: "customer", text: "Warner Brothers and one more, the fourth one is, yeah, Water World." },
  { time: "2:33", speaker: "agent", text: "So you want all the four passes, right?" },
  { time: "2:35", speaker: "customer", text: "Not Water World sir, because she is small no?" },
  { time: "2:40", speaker: "agent", text: "Not Water World? No, Underwater, that is there no? Right, right sir." },
  { time: "2:43", speaker: "customer", text: "And after this sir, on 25th I want to stay in Palm Atlantis." },
  { time: "2:52", speaker: "agent", text: "Okay, on 25th you want to stay in Atlantis." },
  { time: "2:57", speaker: "customer", text: "Yes sir, it's my anniversary right. I want to celebrate there only." },
  { time: "3:03", speaker: "agent", text: "Noted sir." },
  { time: "3:04", speaker: "customer", text: "After that you can do Dubai plan as per your this and see that my kid will enjoy. She is my daughter." },
  { time: "3:14", speaker: "agent", text: "Right sir. There are some mermaid show and all that are there, no?" },
  { time: "3:19", speaker: "customer", text: "Right, right. Dolphinarium, dolphin show as well." },
  { time: "3:22", speaker: "agent", text: "Yes, sir. Dolphin, penguin show. I'll make a note of it and I'll include everything." },
  { time: "3:30", speaker: "agent", text: "Sir, what kind of hotels do you require?" },
  { time: "3:32", speaker: "customer", text: "In Dubai, I need only 4 star hotel because I'll not stay in room, right, sir? In Dubai, yes, and in normal room." },
  { time: "3:40", speaker: "agent", text: "Okay, and at Atlantis, you only want to stay at 25th or 9th?" },
  { time: "3:44", speaker: "customer", text: "Yeah, only one night sir, because it's complicated." },
  { time: "3:47", speaker: "agent", text: "Yes sir, yes sir, I understand sir, I totally understand." },
  { time: "3:51", speaker: "customer", text: "And in Atlantis, we have water park, no? So that's why I'm not opting for water park in Yas Island." },
  { time: "3:56", speaker: "agent", text: "That's perfect sir, I would recommend you the same only." },
  { time: "4:00", speaker: "agent", text: "In Dubai sir, I will give you like Dubai city tour, Burj Khalifa, Miracle Garden, Global Village, I will include everything." },
  { time: "4:08", speaker: "customer", text: "Everything sir, that mosque is also there sir, Dubai mall mosque." },
  { time: "4:12", speaker: "agent", text: "Yes sir, yes sir, Dubai mall is near Burj Khalifa." },
  { time: "4:26", speaker: "agent", text: "And sir in Abu Dhabi, do you want the Abu Dhabi city tour or you only want to explore the theme parks?" },
  { time: "4:27", speaker: "customer", text: "What is there in Abu Dhabi sir?" },
  { time: "4:33", speaker: "agent", text: "Sir there is Baps temple, there is a Grand Mosque as well." },
  { time: "4:35", speaker: "customer", text: "Sir, there is one temple, right? I want to visit that also. Indian temple." },
  { time: "4:38", speaker: "agent", text: "Yes, sir. That is Baps temple, sir." },
  { time: "4:41", speaker: "customer", text: "Then mosque. Only one mosque you make me attend, sir. In Dubai or Abu Dhabi. Which is good one?" },
  { time: "4:49", speaker: "agent", text: "Abu Dhabi one is good, sir." },
  { time: "4:51", speaker: "customer", text: "Then take me there only, sir. Dubai mosque, we will let it be then." },
  { time: "4:55", speaker: "agent", text: "Okay, noted sir." },
  { time: "4:57", speaker: "customer", text: "Sir, if possible in Burj Al Arab, that hotel is there, no? The golden tea. The 24 karat gold tea, sir." },
  { time: "5:11", speaker: "agent", text: "Okay, sir, noted. I'll include that as well." },
  { time: "5:15", speaker: "agent", text: "Sir, do you want like a tour to Palm Jumeirah as well?" },
  { time: "5:21", speaker: "customer", text: "I have only this much idea sir, what I have told you. Now you see sir, what you can include." },
  { time: "5:29", speaker: "agent", text: "Noted sir, noted. So sir, do you want me to share some flight options as well for you?" },
  { time: "5:36", speaker: "customer", text: "Yes sir, and flight options, see sir, if Etihad or Emirates only." },
  { time: "5:41", speaker: "agent", text: "Okay, noted sir. Etihad or Emirates. I'll look if this is available on your requested date." },
  { time: "6:10", speaker: "agent", text: "Okay sir, this is your WhatsApp number only right?" },
  { time: "6:15", speaker: "customer", text: "Yeah yeah sir, this is my call also WhatsApp number also, this number only I have." },
  { time: "6:15", speaker: "agent", text: "Within half an hour, I'll share an itinerary with you. You can go through it and in the evening I'll give a follow-up call and we can discuss it." },
  { time: "6:23", speaker: "customer", text: "Okay, okay, okay sir. Thank you for your time, sir." },
  { time: "6:26", speaker: "agent", text: "Thank you, sir. Have a good day." },
  { time: "6:28", speaker: "customer", text: "Thank you, sir. Thank you." },
];

interface CallSummaryViewProps {
  analysis: CallAnalysis;
}

export function CallSummaryView({ analysis }: CallSummaryViewProps) {
  const compliancePercentage = analysis.compliance_score.percentage;
  
  const getScoreStyle = (score: number) => {
    if (score >= 90) return { text: "text-slate-900", bg: "bg-slate-100 border-slate-200" };
    if (score >= 70) return { text: "text-slate-700", bg: "bg-slate-50 border-slate-200" };
    return { text: "text-slate-600", bg: "bg-white border-slate-200" };
  };

  const scoreStyle = getScoreStyle(compliancePercentage);

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/ao-dashboard">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Call Summary</h1>
            <p className="text-sm text-slate-500">Sales Inquiry • {analysis.timestamp}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Processed in {analysis.processing_time_seconds}s
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Conversation */}
        <div className="flex w-1/2 flex-col border-r border-slate-200">
          <div className="border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-medium text-slate-700">Call Transcript</h2>
              <Badge variant="outline" className="text-[10px]">6:28 duration</Badge>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-3 p-5">
              {DIARIZED_CONVERSATION.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.speaker === "agent" ? "" : "flex-row-reverse"}`}>
                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                    msg.speaker === "agent" 
                      ? "bg-slate-900 text-white" 
                      : "bg-slate-200 text-slate-700"
                  }`}>
                    {msg.speaker === "agent" ? "A" : "C"}
                  </div>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    msg.speaker === "agent" 
                      ? "bg-slate-100" 
                      : "bg-white border border-slate-200"
                  }`}>
                    <p className="text-xs text-slate-700 leading-relaxed">{msg.text}</p>
                    <span className="mt-1 block text-[10px] text-slate-400">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Metrics */}
        <div className="flex w-1/2 flex-col bg-slate-50">
          <div className="border-b border-slate-200 bg-white px-5 py-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-medium text-slate-700">Call Metrics</h2>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-5">
              {/* Score Card */}
              <div className={`rounded-xl border p-5 ${scoreStyle.bg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Compliance Score</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className={`text-4xl font-bold ${scoreStyle.text}`}>
                        {compliancePercentage}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {analysis.compliance_score.items_conveyed} of {analysis.compliance_score.total_mandatory_items} items covered
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-slate-900 text-white text-xs">
                      {analysis.compliance_score.rating}
                    </Badge>
                    <p className="mt-2 text-[10px] text-slate-400">
                      {analysis.insights.customer_sentiment} Sentiment
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-600" />
                    <span className="text-[10px] text-slate-400">Covered</span>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-slate-800">{analysis.conveyed_items.length}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] text-slate-400">Missed</span>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-slate-800">{analysis.missed_items.length}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-slate-500" />
                    <span className="text-[10px] text-slate-400">Actions</span>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-slate-800">{analysis.tasks.length}</p>
                </div>
              </div>

              {/* Items Covered */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-600" />
                  <h3 className="text-sm font-medium text-slate-800">Items Covered</h3>
                  <Badge variant="outline" className="text-[10px]">{analysis.conveyed_items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {analysis.conveyed_items.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                      <div>
                        <p className="text-xs font-medium text-slate-700">{item.item}</p>
                        {item.quote && (
                          <p className="mt-1 text-[10px] text-slate-400 italic">"{item.quote}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {analysis.conveyed_items.length > 5 && (
                    <p className="text-[10px] text-slate-400 text-center">+{analysis.conveyed_items.length - 5} more items</p>
                  )}
                </div>
              </div>

              {/* Items Missed */}
              {analysis.missed_items.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-slate-400" />
                    <h3 className="text-sm font-medium text-slate-800">Items Missed</h3>
                    <Badge variant="outline" className="text-[10px]">{analysis.missed_items.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {analysis.missed_items.map((item, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-medium text-slate-700">{item.item}</p>
                          <Badge variant="outline" className="text-[10px]">
                            {item.importance}
                          </Badge>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">{item.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-slate-500" />
                  <h3 className="text-sm font-medium text-slate-800">Follow-up Actions</h3>
                  <Badge variant="outline" className="text-[10px]">{analysis.tasks.length}</Badge>
                </div>
                <div className="space-y-2">
                  {analysis.tasks.map((task, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-slate-700">{task.task}</p>
                        <Badge variant="outline" className="text-[10px]">{task.deadline}</Badge>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">{task.context}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="rounded-xl bg-slate-900 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-medium text-white">Call Insights</h3>
                </div>
                
                <p className="mb-4 text-xs text-slate-300 leading-relaxed">{analysis.insights.overall_summary}</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="mb-2 text-[10px] font-medium text-slate-400 uppercase tracking-wide">Highlights</p>
                    <ul className="space-y-1">
                      {analysis.insights.positive_highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="text-slate-500">•</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {analysis.insights.areas_of_concern.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-medium text-slate-400 uppercase tracking-wide">Areas to Improve</p>
                      <ul className="space-y-1">
                        {analysis.insights.areas_of_concern.slice(0, 2).map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className="text-slate-500">•</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
