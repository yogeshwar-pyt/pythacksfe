"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { CheckCircle2, Circle, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CallAnimation } from "@/components/call-animation";
import { ShimmerLoader } from "@/components/shimmer-loader";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

const preCallChecklist: ChecklistItem[] = [
  {
    id: "1",
    text: "Greet customer warmly and introduce yourself",
    completed: false,
  },
  { id: "2", text: "Confirm customer's name and booking ID", completed: false },
  { id: "3", text: "Review lounge location and amenities", completed: false },
  { id: "4", text: "Mention dietary options available", completed: false },
  { id: "5", text: "Explain voucher benefits and discount", completed: false },
  {
    id: "6",
    text: "Ask about special requests or preferences",
    completed: false,
  },
  { id: "7", text: "Confirm arrival time at airport", completed: false },
  {
    id: "8",
    text: "Provide contact information for questions",
    completed: false,
  },
  {
    id: "9",
    text: "Thank customer and wish them safe travels",
    completed: false,
  },
];

const voucherDetails = {
  customerName: "Sarah Johnson",
};

export default function VrtCallPage() {
  const router = useRouter();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(preCallChecklist);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleCallComplete = () => {
    setIsCallActive(false);
    setIsRedirecting(true);
    setTimeout(() => {
      router.push("/call-analysis");
    }, 1500);
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;

  return (
    <div className="flex h-screen flex-col">
      <AppHeader
        pageTitle="VRT Call"
        actionButton={
          !isCallActive ? (
            <button
              onClick={handleStartCall}
              className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              <Phone className="h-4 w-4" />
              Start Call
            </button>
          ) : null
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Pre-Call Checklist (50%) */}
        <div className="flex w-1/2 flex-col border-r border-slate-200">
          <div className="border-b border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Pre-Call Checklist
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {completedCount} of {totalCount} items completed
            </p>
          </div>

          <ScrollArea className="flex-1 bg-slate-50">
            <div className="space-y-2 p-4">
              {checklist.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer border p-3 transition-all hover:shadow-sm ${
                    item.completed
                      ? "border-green-200 bg-green-50"
                      : "border-slate-200 bg-white"
                  }`}
                  onClick={() => !isCallActive && toggleChecklistItem(item.id)}
                >
                  <div className="flex items-start gap-3">
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 flex-shrink-0 text-slate-400" />
                    )}
                    <span
                      className={`text-sm ${
                        item.completed
                          ? "text-slate-500 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Voucher View (50%) */}
        <div className="flex w-1/2 flex-col bg-white">
          {isRedirecting ? (
            <div className="flex flex-1 items-center justify-center bg-slate-50">
              <ShimmerLoader />
            </div>
          ) : isCallActive ? (
            <div className="flex flex-1 items-center justify-center bg-slate-50">
              <div className="w-full max-w-md">
                <CallAnimation onComplete={handleCallComplete} />
                <p className="mt-4 text-center text-sm text-slate-600">
                  Call in progress with {voucherDetails.customerName}...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Voucher Information
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Review before call
                </p>
              </div>

              <div className="flex-1 p-4">
                <iframe
                  src="https://plato-documents-bak.s3.ap-south-1.amazonaws.com/115715/final_voucher_115715.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4OK42ESOUT55CDPH%2F20260130%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260130T195927Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=92e16059e02ed5ee1dd450cf8cca85dafe73f775cebb28f7a792972cb8d5944c"
                  className="h-full w-full rounded-lg border border-slate-200"
                  title="Voucher PDF"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
