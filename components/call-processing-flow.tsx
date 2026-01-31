"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic,
  Users,
  UserCircle,
  Loader2,
  CheckCircle2,
  Play,
  RotateCcw,
  MapPin,
  Calendar,
  Heart,
  Plane,
  Hotel,
  Star,
} from "lucide-react";

// Hardcoded transcript
const TRANSCRIPT_RAW = `[0000.880 --> 0005.828] Hello, good afternoon sir, Ravi this side calling from Picky Outrail.
[0005.828 --> 0011.349] Actually sir, I have received an enquiry of yours regarding a Dubai vacation.
[0011.349 --> 0012.855] Are you planning one?
[0012.855 --> 0015.150] Yes sir, yes sir, I am planning.
[0015.150 --> 0020.026] So is it a good time to speak with you regarding the same right now?
[0020.026 --> 0021.245] Yes sir, yes sir.
[0021.245 --> 0024.543] Sir, can you tell me your travel dates please?
[0024.543 --> 0028.272] Sir, I am, one second, I am planning for April 21st.
[0028.304 --> 0032.015] May means April 31st returns like 9 nights 10 days.
[0032.015 --> 0038.928] Okay for 9 nights 10 days you are planning and sir how many people will be travelling with you?
[0038.928 --> 0040.675] Couple and a small baby.
[0040.675 --> 0042.567] Baby means she is 4 years.
[0042.567 --> 0043.295] Okay okay.
[0043.295 --> 0046.278] Notice 2 adults and 1 child that will be.
[0046.278 --> 0046.860] Yes sir.
[0046.860 --> 0047.224] Okay.
[0047.224 --> 0054.574] And sir like what are you like travelling for some special occasion or just a normal summer vacation?
[0054.574 --> 0057.776] No sir actually it's my anniversary on 25th.
[0058.000 --> 0087.744] 25th of your anniversary wow congratulations sir thank you sir for that means vacation also in that occasion also ok noted noted so sir do you want just only want to like stay in Dubai or do you want to explore Abu Dhabi as well everything sir for 9 nights that's why I am going once so I have to see everything again I will not go like that ok noted sir sir what will be your departing city what sir sir your city of departure
[0087.744 --> 0109.133] Bangalore okay perfect sir you can find a really good sites from there so if you have time can I like tell you some few details like what kind of trip I can make for you like on your opening day or day of arrival by maximum you will check into your hotels by 3 p.m.`;

// Hardcoded diarized conversation
const DIARIZED_CONVERSATION = [
  { time: "0:00", speaker: "agent", text: "Hello, good afternoon sir, Ravi this side calling from Picky Outrail." },
  { time: "0:05", speaker: "agent", text: "Actually sir, I have received an enquiry of yours regarding a Dubai vacation." },
  { time: "0:11", speaker: "customer", text: "Are you planning one?" },
  { time: "0:12", speaker: "customer", text: "Yes sir, yes sir, I am planning." },
  { time: "0:15", speaker: "customer", text: "So is it a good time to speak with you regarding the same right now?" },
  { time: "0:20", speaker: "agent", text: "Yes sir, yes sir." },
  { time: "0:21", speaker: "agent", text: "Sir, can you tell me your travel dates please?" },
  { time: "0:24", speaker: "customer", text: "Sir, I am, one second, I am planning for April 21st." },
  { time: "0:28", speaker: "agent", text: "May means April 31st returns like 9 nights 10 days." },
  { time: "0:32", speaker: "agent", text: "Okay for 9 nights 10 days you are planning and sir how many people will be travelling with you?" },
  { time: "0:38", speaker: "customer", text: "Couple and a small baby." },
  { time: "0:40", speaker: "customer", text: "Baby means she is 4 years." },
  { time: "0:43", speaker: "agent", text: "Notice 2 adults and 1 child that will be." },
  { time: "0:47", speaker: "agent", text: "And sir like what are you like travelling for some special occasion or just a normal summer vacation?" },
  { time: "0:54", speaker: "customer", text: "No sir actually it's my anniversary on 25th." },
  { time: "0:58", speaker: "customer", text: "25th of your anniversary wow congratulations sir thank you sir for that means vacation also in that occasion also ok noted noted so sir do you want just only want to like stay in Dubai or do you want to explore Abu Dhabi as well everything sir for 9 nights that's why I am going once so I have to see everything again I will not go like that" },
  { time: "1:27", speaker: "agent", text: "Bangalore okay perfect sir you can find a really good sites from there so if you have time can I like tell you some few details like what kind of trip I can make for you." },
  { time: "1:49", speaker: "customer", text: "Okay sir can I tell you what all I need, sir." },
  { time: "1:54", speaker: "agent", text: "Sure, yes. I'll make a note of everything." },
  { time: "2:01", speaker: "customer", text: "First, I want to land in Abu Dhabi, sir. And I want three days in that Yas Island." },
  { time: "2:14", speaker: "agent", text: "And I want all the passes for Ferrari World, Warner Bros, Sea World." },
  { time: "2:39", speaker: "customer", text: "Warner Brothers and one more, the fourth one is, yeah, Water World." },
  { time: "2:43", speaker: "customer", text: "Not Water World sir, because she is small no?" },
  { time: "2:52", speaker: "customer", text: "And after this sir, on 25th if I want to stay in Palm Atlantis. It's my anniversary right. I want to celebrate there only." },
  { time: "3:04", speaker: "agent", text: "Noted sir." },
  { time: "3:15", speaker: "customer", text: "There are some mermaid show and all that are there, no? My daughter will enjoy." },
  { time: "3:20", speaker: "agent", text: "Right, right. Dolphinarium, dolphin show as well." },
];

export interface CustomerProfile {
  name: string;
  departureCity: string;
  travelDates: string;
  tripDuration: string;
  partyComposition: string;
  occasion: string;
  destinations: string[];
  interests: string[];
  hotelPreferences: string;
  budgetIndicators: string;
  specialRequests: string[];
  communicationStyle: string;
  rapportTips: string[];
  createdAt: string;
}

type Step = "idle" | "transcribing" | "transcribed" | "diarizing" | "diarized" | "profiling" | "profiled";

export function CallProcessingFlow() {
  const [step, setStep] = useState<Step>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [diarized, setDiarized] = useState<typeof DIARIZED_CONVERSATION>([]);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("customerProfile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
        setStep("profiled");
        setDiarized(DIARIZED_CONVERSATION);
        setTranscript(TRANSCRIPT_RAW);
      } catch (e) {
        console.error("Failed to load profile:", e);
      }
    }
  }, []);

  const handleTranscribe = async () => {
    setStep("transcribing");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTranscript(TRANSCRIPT_RAW);
    setStep("transcribed");
  };

  const handleDiarize = async () => {
    setStep("diarizing");
    await new Promise(resolve => setTimeout(resolve, 1200));
    setDiarized(DIARIZED_CONVERSATION);
    setStep("diarized");
  };

  const handleGenerateProfile = async () => {
    setStep("profiling");
    
    try {
      const response = await fetch("/api/customer-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: diarized.map(d => `[${d.speaker.toUpperCase()}] ${d.text}`) }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        localStorage.setItem("customerProfile", JSON.stringify(data.profile));
        setStep("profiled");
        return;
      }
    } catch (error) {
      console.error("Error generating profile:", error);
    }

    // Fallback mock
    const mockProfile: CustomerProfile = {
      name: "Customer",
      departureCity: "Bangalore",
      travelDates: "April 21st - April 30th",
      tripDuration: "9 nights 10 days",
      partyComposition: "Couple with 4-year-old daughter",
      occasion: "Wedding Anniversary (25th)",
      destinations: ["Abu Dhabi (Yas Island)", "Dubai", "Palm Atlantis"],
      interests: ["Theme parks (Ferrari World, Warner Bros, Sea World)", "Kid-friendly activities", "Luxury stay at Atlantis", "Cultural visits"],
      hotelPreferences: "4-star in Dubai, Atlantis for anniversary night",
      budgetIndicators: "Premium segment - willing to spend on experiences",
      specialRequests: ["Must stay at Atlantis on 25th (anniversary)", "Emirates/Etihad flights only", "Child-friendly activities priority"],
      communicationStyle: "Respectful, detail-oriented, knows what he wants",
      rapportTips: [
        "Congratulate on anniversary - it's a special trip",
        "Emphasize daughter will love the dolphin and mermaid shows",
        "Highlight Atlantis water park as included benefit",
        "Mention the 24-karat gold tea at Burj Al Arab",
        "He prefers quality over budget - upsell premium experiences"
      ],
      createdAt: new Date().toISOString(),
    };
    setProfile(mockProfile);
    localStorage.setItem("customerProfile", JSON.stringify(mockProfile));
    setStep("profiled");
  };

  const handleReset = () => {
    setStep("idle");
    setTranscript("");
    setDiarized([]);
    setProfile(null);
    localStorage.removeItem("customerProfile");
  };

  const getStepNumber = () => {
    if (["idle", "transcribing"].includes(step)) return 1;
    if (["transcribed", "diarizing"].includes(step)) return 2;
    if (["diarized", "profiling"].includes(step)) return 3;
    return 4;
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Call Processing</h1>
          <p className="text-sm text-slate-500">Transform call recordings into actionable customer insights</p>
        </div>
        {step !== "idle" && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <StepPill step={1} current={getStepNumber()} label="Transcribe" />
          <div className="h-px w-8 bg-slate-200" />
          <StepPill step={2} current={getStepNumber()} label="Diarize" />
          <div className="h-px w-8 bg-slate-200" />
          <StepPill step={3} current={getStepNumber()} label="Profile" />
          <div className="h-px w-8 bg-slate-200" />
          <StepPill step={4} current={getStepNumber()} label="Complete" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Transcript/Diarized */}
        <div className="flex w-1/2 flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-700">
                {step === "idle" || step === "transcribing" ? "Raw Audio" : 
                 step === "transcribed" ? "Transcript" : "Conversation"}
              </h2>
              {step === "idle" && (
                <button
                  onClick={handleTranscribe}
                  className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <Play className="h-4 w-4" />
                  Start Transcription
                </button>
              )}
              {step === "transcribed" && (
                <button
                  onClick={handleDiarize}
                  className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <Users className="h-4 w-4" />
                  Identify Speakers
                </button>
              )}
              {step === "diarized" && (
                <button
                  onClick={handleGenerateProfile}
                  className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <UserCircle className="h-4 w-4" />
                  Generate Profile
                </button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-5">
              {step === "idle" && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <Mic className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">Click "Start Transcription" to process the call recording</p>
                </div>
              )}

              {step === "transcribing" && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="mb-4 h-8 w-8 animate-spin text-slate-400" />
                  <p className="text-sm text-slate-600">Transcribing audio...</p>
                </div>
              )}

              {step === "transcribed" && transcript && (
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-600">
                  {transcript}
                </pre>
              )}

              {step === "diarizing" && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="mb-4 h-8 w-8 animate-spin text-slate-400" />
                  <p className="text-sm text-slate-600">Identifying speakers...</p>
                </div>
              )}

              {["diarized", "profiling", "profiled"].includes(step) && diarized.length > 0 && (
                <div className="space-y-3">
                  {diarized.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.speaker === "agent" ? "" : "flex-row-reverse"}`}>
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                        msg.speaker === "agent" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"
                      }`}>
                        {msg.speaker === "agent" ? "A" : "C"}
                      </div>
                      <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        msg.speaker === "agent" ? "bg-slate-100" : "bg-slate-50 border border-slate-200"
                      }`}>
                        <p className="text-sm text-slate-700">{msg.text}</p>
                        <span className="mt-1 block text-[10px] text-slate-400">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Profile */}
        <div className="flex w-1/2 flex-col bg-slate-50">
          <div className="border-b border-slate-200 bg-white px-5 py-3">
            <h2 className="text-sm font-medium text-slate-700">Customer Profile</h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-5">
              {step === "profiling" && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="mb-4 h-8 w-8 animate-spin text-slate-400" />
                  <p className="text-sm text-slate-600">Analyzing conversation...</p>
                </div>
              )}

              {step !== "profiled" && step !== "profiling" && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
                    <UserCircle className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">Complete all steps to generate customer profile</p>
                </div>
              )}

              {step === "profiled" && profile && (
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard icon={<MapPin className="h-4 w-4" />} label="From" value={profile.departureCity} />
                    <StatCard icon={<Calendar className="h-4 w-4" />} label="Dates" value={profile.travelDates} />
                    <StatCard icon={<Users className="h-4 w-4" />} label="Travelers" value={profile.partyComposition} />
                    <StatCard icon={<Heart className="h-4 w-4" />} label="Occasion" value={profile.occasion} />
                  </div>

                  {/* Destinations */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Plane className="h-4 w-4 text-slate-500" />
                      <h3 className="text-sm font-medium text-slate-800">Destinations</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.destinations.map((dest, i) => (
                        <Badge key={i} variant="outline" className="bg-slate-50">{dest}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Hotels */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Hotel className="h-4 w-4 text-slate-500" />
                      <h3 className="text-sm font-medium text-slate-800">Hotel Preferences</h3>
                    </div>
                    <p className="text-sm text-slate-600">{profile.hotelPreferences}</p>
                  </div>

                  {/* Special Requests */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-slate-500" />
                      <h3 className="text-sm font-medium text-slate-800">Special Requests</h3>
                    </div>
                    <ul className="space-y-2">
                      {profile.specialRequests.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rapport Tips */}
                  <div className="rounded-lg border border-slate-900 bg-slate-900 p-4">
                    <h3 className="mb-3 text-sm font-medium text-white">Rapport Building Tips</h3>
                    <ul className="space-y-2">
                      {profile.rapportTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-slate-500">→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function StepPill({ step, current, label }: { step: number; current: number; label: string }) {
  const isComplete = current > step;
  const isActive = current === step;
  
  return (
    <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
      isComplete ? "bg-slate-900 text-white" :
      isActive ? "bg-slate-200 text-slate-900" :
      "bg-slate-100 text-slate-400"
    }`}>
      {isComplete ? <CheckCircle2 className="h-3 w-3" /> : <span>{step}</span>}
      <span>{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-1 flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-medium text-slate-800 truncate" title={value}>{value}</p>
    </div>
  );
}
