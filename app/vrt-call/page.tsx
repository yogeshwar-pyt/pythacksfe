"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { CheckCircle2, Circle, Phone, ListChecks, FileText, Loader2, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CallAnimation } from "@/components/call-animation";
import { ShimmerLoader } from "@/components/shimmer-loader";
import { RapportPanel } from "@/components/rapport-panel";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Heart, Building2, Plane, Clock, Sparkles } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

const preCallChecklist: ChecklistItem[] = [
  {
    id: "1",
    text: "Confirm travel dates: April 21st departure, April 30th return - 9 nights 10 days",
    completed: false,
  },
  {
    id: "2",
    text: "Verify traveler details: 2 adults and 1 child (4 years old daughter)",
    completed: false,
  },
  {
    id: "3",
    text: "Documents to carry: Passports, flight tickets, hotel vouchers, visa printouts, travel insurance",
    completed: false,
  },
  {
    id: "4",
    text: "Abu Dhabi Yas Island: Ferrari World, Warner Bros, Sea World passes included - inform about park timings",
    completed: false,
  },
  {
    id: "5",
    text: "Palm Atlantis stay on April 25th (Anniversary): Confirm booking, mention complimentary water park access",
    completed: false,
  },
  {
    id: "6",
    text: "Dubai activities: Burj Khalifa timing, Miracle Garden, Global Village, Dubai City Tour schedule",
    completed: false,
  },
  {
    id: "7",
    text: "BAPS Mandir: Register online 1 day prior at mandir.ae/visit, carry passport, closed on Mondays",
    completed: false,
  },
  {
    id: "8",
    text: "Grand Mosque Abu Dhabi: Dress code requirements, visiting hours, photography rules",
    completed: false,
  },
  {
    id: "9",
    text: "Flight details: Etihad/Emirates confirmed, baggage allowance 30kg checked + 7kg cabin per person",
    completed: false,
  },
  {
    id: "10",
    text: "Kid-friendly activities: Dolphin show, Penguin encounter, Atlantis Aquaventure for the daughter",
    completed: false,
  },
];

const voucherDetails = {
  customerName: "Sarah Johnson",
};

function VrtCallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callId = searchParams.get("callId") || `call-${Date.now()}`;
  const [checklist, setChecklist] = useState<ChecklistItem[]>(preCallChecklist);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [activeTab, setActiveTab] = useState<"checklist" | "voucher">("checklist");
  const [isRapportOpen, setIsRapportOpen] = useState(false);
  const [leftPanelTab, setLeftPanelTab] = useState<"checkpoints" | "profile">("checkpoints");
  const [customerProfile, setCustomerProfile] = useState<any>(null);

  // Load profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("customerProfile");
    if (savedProfile) {
      setCustomerProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleCallComplete = () => {
    setIsCallActive(false);
    setIsRedirecting(true);
    
    // Pass checklist data to analysis page
    const checklistData = encodeURIComponent(JSON.stringify(checklist));
    
    setTimeout(() => {
      router.push(`/call-analysis?checklist=${checklistData}`);
    }, 1500);
  };

  const handleChecklistUpdate = (updatedItems: ChecklistItem[]) => {
    setChecklist(updatedItems);
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;

  return (
    <div className="flex h-screen flex-col">
      <AppHeader
        pageTitle="VRT Call"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRapportOpen(true)}
              className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <UserCircle className="h-4 w-4" />
              Rapport
            </button>
            {!isCallActive && (
              <button
                onClick={handleStartCall}
                className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                <Phone className="h-4 w-4" />
                Start Call
              </button>
            )}
          </div>
        }
      />

      <RapportPanel isOpen={isRapportOpen} onClose={() => setIsRapportOpen(false)} />

      <div className="flex flex-1 overflow-hidden bg-slate-50">
        {/* Left: Checklist/Profile Tabs (40%) */}
        <div className="flex w-[40%] flex-col border-r border-slate-200 bg-white">
          {/* Tab Header */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setLeftPanelTab("checkpoints")}
              className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                leftPanelTab === "checkpoints"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ListChecks className="h-4 w-4" />
              Checkpoints
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                leftPanelTab === "checkpoints" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {completedCount}/{totalCount}
              </span>
            </button>
            <button
              onClick={() => setLeftPanelTab("profile")}
              className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                leftPanelTab === "profile"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <UserCircle className="h-4 w-4" />
              Profile
            </button>
          </div>

          {/* Tab Content */}
          {leftPanelTab === "checkpoints" ? (
            <ScrollArea className="flex-1">
              <div className="space-y-2 p-4">
                {checklist.map((item, index) => (
                  <Card
                    key={item.id}
                    className={`border p-3 transition-colors ${
                      item.completed
                        ? "border-slate-300 bg-slate-100"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.completed ? (
                        <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-slate-600">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500">
                          <span className="text-[9px] font-medium">{index + 1}</span>
                        </div>
                      )}
                      <span
                        className={`text-[13px] leading-relaxed ${
                          item.completed
                            ? "text-slate-600"
                            : "text-slate-700"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <ScrollArea className="flex-1">
              {customerProfile ? (
                <div className="p-5 space-y-4">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white text-xl font-semibold">
                      {customerProfile.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'CU'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{customerProfile.name || 'Customer'}</h3>
                      <p className="text-sm text-slate-500">{customerProfile.occupation || 'Traveler'}</p>
                    </div>
                  </div>

                  {/* Trip Info Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Plane className="h-3 w-3 text-slate-400" />
                        <span className="text-[9px] text-slate-400 uppercase">From</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">Bangalore</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className="text-[9px] text-slate-400 uppercase">Dates</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">Apr 21 - Apr 30</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-[9px] text-slate-400 uppercase">Duration</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">9N / 10D</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Users className="h-3 w-3 text-slate-400" />
                        <span className="text-[9px] text-slate-400 uppercase">Travelers</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">2 Adults + 1 Child</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Heart className="h-3 w-3 text-slate-400" />
                        <span className="text-[9px] text-slate-400 uppercase">Occasion</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">Anniversary (Apr 25)</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        <span className="text-[9px] text-slate-400 uppercase">Hotels</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">4-star + Atlantis</p>
                    </div>
                  </div>

                  {/* Destinations */}
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-2">Destinations</p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-[10px]"><MapPin className="h-2.5 w-2.5 mr-1" />Abu Dhabi (Yas Island)</Badge>
                      <Badge variant="outline" className="text-[10px]"><MapPin className="h-2.5 w-2.5 mr-1" />Dubai</Badge>
                      <Badge variant="outline" className="text-[10px]"><MapPin className="h-2.5 w-2.5 mr-1" />Palm Atlantis</Badge>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-2">Special Requests</p>
                    <div className="space-y-1">
                      <div className="flex items-start gap-2 text-xs text-slate-600"><span className="text-slate-400">•</span>Ferrari World, Warner Bros, Sea World passes</div>
                      <div className="flex items-start gap-2 text-xs text-slate-600"><span className="text-slate-400">•</span>Anniversary celebration at Palm Atlantis</div>
                      <div className="flex items-start gap-2 text-xs text-slate-600"><span className="text-slate-400">•</span>BAPS Temple & Grand Mosque visit</div>
                      <div className="flex items-start gap-2 text-xs text-slate-600"><span className="text-slate-400">•</span>Burj Al Arab 24K Gold Tea experience</div>
                      <div className="flex items-start gap-2 text-xs text-slate-600"><span className="text-slate-400">•</span>Kid-friendly: Dolphin show, Mermaid show</div>
                      <div className="flex items-start gap-2 text-xs text-slate-600"><span className="text-slate-400">•</span>Burj Khalifa, Miracle Garden, Global Village</div>
                    </div>
                  </div>

                  {/* Profile Traits */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <p className="text-[9px] font-medium text-slate-400 uppercase">Travel Style</p>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{customerProfile.travel_style || 'Family Comfort'}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <p className="text-[9px] font-medium text-slate-400 uppercase">Communication</p>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{customerProfile.communication_preference || 'Direct'}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <p className="text-[9px] font-medium text-slate-400 uppercase">Decision Style</p>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{customerProfile.decision_style || 'Research-driven'}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <p className="text-[9px] font-medium text-slate-400 uppercase">Budget</p>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{customerProfile.budget_consciousness || 'Premium'}</p>
                    </div>
                  </div>

                  {/* Key Concerns */}
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-2">Key Concerns</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600">Child safety</span>
                      <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600">Anniversary special</span>
                      <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600">Premium experience</span>
                    </div>
                  </div>

                  {/* Rapport Tips */}
                  <div className="rounded-xl bg-slate-900 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-3.5 w-3.5 text-slate-400" />
                      <p className="text-xs font-medium text-white">Rapport Tips</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-[11px] text-slate-400"><span className="text-slate-500">→</span>Congratulate on upcoming anniversary, make it special</div>
                      <div className="flex items-start gap-2 text-[11px] text-slate-400"><span className="text-slate-500">→</span>Mention daughter-friendly activities at each location</div>
                      <div className="flex items-start gap-2 text-[11px] text-slate-400"><span className="text-slate-500">→</span>Highlight Atlantis water park (skipped Yas Water World)</div>
                      <div className="flex items-start gap-2 text-[11px] text-slate-400"><span className="text-slate-500">→</span>Emphasize Grand Mosque over Dubai mosque per preference</div>
                      <div className="flex items-start gap-2 text-[11px] text-slate-400"><span className="text-slate-500">→</span>Mention Etihad/Emirates flight preference confirmed</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                  <UserCircle className="h-12 w-12 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-600">No Profile Available</p>
                  <p className="text-xs text-slate-400 mt-1">Process a call transcript to generate customer profile</p>
                </div>
              )}
            </ScrollArea>
          )}
        </div>

        {/* Middle: Voucher (40%) */}
        <div className="flex w-[40%] flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900">
                <FileText className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Travel Voucher</h3>
                <p className="text-xs text-slate-600">Customer details & itinerary</p>
              </div>
            </div>
          </div>
          <div className="flex-1 p-5">
            <embed
              src="https://plato-documents-bak.s3.ap-south-1.amazonaws.com/115715/final_voucher_115715.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4OK42ESOUT55CDPH%2F20260130%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260130T195927Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=92e16059e02ed5ee1dd450cf8cca85dafe73f775cebb28f7a792972cb8d5944c#toolbar=0&navpanes=0&scrollbar=0"
              type="application/pdf"
              className="h-full w-full rounded-lg border border-slate-200"
            />
          </div>
        </div>

        {/* Right: Call Status (20%) */}
        <div className="flex w-[20%] flex-col bg-white">
          {isRedirecting ? (
            <div className="flex flex-1 items-center justify-center bg-slate-50">
              <ShimmerLoader />
            </div>
          ) : isCallActive ? (
            <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
              <div className="w-full max-w-md">
                <CallAnimation 
                  onComplete={handleCallComplete}
                  callId={callId}
                  checklistItems={checklist}
                  onChecklistUpdate={handleChecklistUpdate}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 p-6">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <Phone className="h-8 w-8 text-slate-700" />
              </div>
              <p className="mb-2 text-center text-sm font-semibold text-slate-900">
                Ready to call
              </p>
              <p className="mb-1 text-center text-sm text-slate-700">
                {voucherDetails.customerName}
              </p>
              <p className="mb-6 text-center text-xs text-slate-500">
                Review checklist & voucher before starting
              </p>
              <button
                onClick={handleStartCall}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                <Phone className="h-4 w-4" />
                Start Call
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VrtCallPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      }
    >
      <VrtCallContent />
    </Suspense>
  );
}
