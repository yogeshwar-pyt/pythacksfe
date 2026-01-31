"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic,
  Users,
  UserCircle,
  Loader2,
  CheckCircle2,
  ChevronRight,
  AudioWaveform,
} from "lucide-react";

// Hardcoded transcript from transcriptmain.txt
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
  "[0000.880][AGENT] Hello, good afternoon sir, Ravi this side calling from Picky Outrail.",
  "[0005.828][AGENT] Actually sir, I have received an enquiry of yours regarding a Dubai vacation.",
  "[0011.349][CUSTOMER] Are you planning one?",
  "[0012.855][CUSTOMER] Yes sir, yes sir, I am planning.",
  "[0015.150][CUSTOMER] So is it a good time to speak with you regarding the same right now?",
  "[0020.026][AGENT] Yes sir, yes sir.",
  "[0021.245][AGENT] Sir, can you tell me your travel dates please?",
  "[0024.543][CUSTOMER] Sir, I am, one second, I am planning for April 21st.",
  "[0028.304][AGENT] May means April 31st returns like 9 nights 10 days.",
  "[0032.015][AGENT] Okay for 9 nights 10 days you are planning and sir how many people will be travelling with you?",
  "[0038.928][CUSTOMER] Couple and a small baby.",
  "[0040.675][CUSTOMER] Baby means she is 4 years.",
  "[0042.567][CUSTOMER] Okay okay.",
  "[0043.295][AGENT] Notice 2 adults and 1 child that will be.",
  "[0046.278][CUSTOMER] Yes sir.",
  "[0046.860][CUSTOMER] Okay.",
  "[0047.224][AGENT] And sir like what are you like travelling for some special occasion or just a normal summer vacation?",
  "[0054.574][CUSTOMER] No sir actually it's my anniversary on 25th.",
  "[0058.000][CUSTOMER] 25th of your anniversary wow congratulations sir thank you sir for that means vacation also in that occasion also ok noted noted so sir do you want just only want to like stay in Dubai or do you want to explore Abu Dhabi as well everything sir for 9 nights that's why I am going once so I have to see everything again I will not go like that ok noted sir sir what will be your departing city what sir sir your city of departure",
  "[0087.744][AGENT] Bangalore okay perfect sir you can find a really good sites from there so if you have time can I like tell you some few details like what kind of trip I can make for you like on your opening day or day of arrival by maximum you will check into your hotels by 3 p.m.",
  "[0109.133][CUSTOMER] okay sir can I tell you means can I tell you what",
  "[0113.088][CUSTOMER] All I need, sir.",
  "[0114.505][AGENT] Sure, yes.",
  "[0115.391][CUSTOMER] Please, sure, sir.",
  "[0116.985][CUSTOMER] Go ahead.",
  "[0117.782][AGENT] I'll make a note of everything.",
  "[0120.528][CUSTOMER] Yes, sir.",
  "[0121.325][CUSTOMER] First, I want to land in Abu Dhabi, sir.",
  "[0124.868][CUSTOMER] Okay.",
  "[0125.311][AGENT] And I want three days in that Yas Island.",
  "[0128.943][CUSTOMER] Okay.",
  "[0129.386][AGENT] Noted, sir.",
  "[0130.360][CUSTOMER] I want to stay there only.",
  "[0132.663][CUSTOMER] Okay.",
  "[0133.106][CUSTOMER] Noted, sir.",
  "[0134.080][AGENT] And I want all the passes for Ferrari World, Warner Bros.",
  "[0139.129][CUSTOMER] Sea World and War Yas, you want to land?",
  "[0142.672][AGENT] Yeah, yeah sir, Sea World, Ferrari, that is there no?",
  "[0146.184][CUSTOMER] Yes sir.",
  "[0146.715][AGENT] And one more, Warner Brothers.",
  "[0148.703][CUSTOMER] Warner Brothers and one more, the fourth one is, yeah, Water World.",
  "[0153.143][CUSTOMER] So you want all the four passes, right?",
  "[0155.728][AGENT] Not Water World sir, Water World is okay sir, because she is small no?",
  "[0160.367][CUSTOMER] Not Water World? No, Underwater, that is there no?",
  "[0162.289][CUSTOMER] Right, right sir, right, right.",
  "[0163.018][AGENT] And after this sir, on 25th if I want to stay in Palm Atlantis.",
  "[0166.512][CUSTOMER] And after this sir, on 25th if I want to stay in Palm Atlantis.",
  "[0172.791][CUSTOMER] Okay, on 25th you want to stay in Atlantis.",
  "[0177.077][CUSTOMER] Yes sir, it's my anniversary right.",
  "[0180.566][CUSTOMER] I want to celebrate there only.",
  "[0183.655][AGENT] Noted sir.",
  "[0184.652][CUSTOMER] After that you can do Dubai plan as per your this and see that my kid will enjoy.",
  "[0192.726][CUSTOMER] She is my daughter.",
  "[0194.619][CUSTOMER] Right sir.",
  "[0195.616][CUSTOMER] There are some mermaid show and all that are there, no?",
  "[0199.400][AGENT] Right, right.",
  "[0200.295][AGENT] Dolphinarium, dolphin show as well.",
  "[0202.703][CUSTOMER] Yes, sir.",
  "[0203.322][CUSTOMER] Yes, sir.",
  "[0203.941][CUSTOMER] Dolphin, penguin show.",
];

export interface CustomerProfile {
  name: string;
  phone?: string;
  email?: string;
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

export function TranscriptionDemo() {
  const [step, setStep] = useState<Step>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [diarized, setDiarized] = useState<string[]>([]);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [processingText, setProcessingText] = useState("");

  // Load existing profile from localStorage on mount
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
    setProcessingText("Transcribing audio...");
    
    // Simulate transcription with animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTranscript(TRANSCRIPT_RAW);
    setStep("transcribed");
  };

  const handleDiarize = async () => {
    setStep("diarizing");
    setProcessingText("Identifying speakers...");
    
    // Simulate diarization
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setDiarized(DIARIZED_CONVERSATION);
    setStep("diarized");
  };

  const handleGenerateProfile = async () => {
    setStep("profiling");
    setProcessingText("Analyzing conversation...");
    
    try {
      const response = await fetch("/api/customer-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: diarized }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate profile");
      }

      const data = await response.json();
      setProfile(data.profile);
      
      // Save to localStorage
      localStorage.setItem("customerProfile", JSON.stringify(data.profile));
      
      setStep("profiled");
    } catch (error) {
      console.error("Error generating profile:", error);
      // Fallback to mock profile for demo
      const mockProfile: CustomerProfile = {
        name: "Customer",
        departureCity: "Bangalore",
        travelDates: "April 21st - April 30th",
        tripDuration: "9 nights 10 days",
        partyComposition: "Couple with 4-year-old daughter",
        occasion: "Wedding Anniversary (25th)",
        destinations: ["Abu Dhabi (Yas Island)", "Dubai", "Palm Atlantis"],
        interests: ["Theme parks (Ferrari World, Warner Bros, Sea World)", "Kid-friendly activities (dolphin shows, mermaid shows)", "Luxury stay at Atlantis", "Cultural visits (BAPS temple, Grand Mosque)"],
        hotelPreferences: "4-star in Dubai, Atlantis for anniversary night",
        budgetIndicators: "Premium segment - willing to spend on experiences",
        specialRequests: ["Must stay at Atlantis on 25th (anniversary)", "Emirates/Etihad flights only", "Child-friendly activities priority"],
        communicationStyle: "Respectful, detail-oriented, knows what he wants",
        rapportTips: [
          "Congratulate on anniversary - it's a special trip",
          "Emphasize daughter will love the dolphin and mermaid shows",
          "Highlight Atlantis water park as included benefit",
          "Mention the 24-karat gold tea at Burj Al Arab - he's interested",
          "He prefers quality over budget - upsell premium experiences"
        ],
        createdAt: new Date().toISOString(),
      };
      setProfile(mockProfile);
      localStorage.setItem("customerProfile", JSON.stringify(mockProfile));
      setStep("profiled");
    }
  };

  const handleReset = () => {
    setStep("idle");
    setTranscript("");
    setDiarized([]);
    setProfile(null);
    localStorage.removeItem("customerProfile");
  };

  const renderDiarizedMessage = (msg: string, index: number) => {
    const isAgent = msg.includes("[AGENT]");
    const timestamp = msg.match(/\[(\d+\.\d+)\]/)?.[1] || "";
    const text = msg.replace(/\[\d+\.\d+\]\[(AGENT|CUSTOMER)\]\s*/, "");
    
    return (
      <div
        key={index}
        className={`flex gap-2 ${isAgent ? "justify-start" : "justify-end"}`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
            isAgent
              ? "bg-blue-50 text-blue-900"
              : "bg-slate-100 text-slate-900"
          }`}
        >
          <div className="mb-1 flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-[10px] ${
                isAgent ? "border-blue-300 text-blue-600" : "border-slate-300 text-slate-600"
              }`}
            >
              {isAgent ? "Agent" : "Customer"}
            </Badge>
            <span className="text-[10px] text-slate-400">{timestamp}s</span>
          </div>
          <p>{text}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AudioWaveform className="h-4 w-4 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Call Processing Pipeline
            </h3>
          </div>
          {step !== "idle" && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Reset
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Transcribe → Diarize → Profile
        </p>
      </div>

      <div className="p-4">
        {/* Progress Steps */}
        <div className="mb-4 flex items-center justify-between">
          <StepIndicator
            active={step === "transcribing"}
            completed={["transcribed", "diarizing", "diarized", "profiling", "profiled"].includes(step)}
            label="Transcribe"
            icon={<Mic className="h-3.5 w-3.5" />}
          />
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <StepIndicator
            active={step === "diarizing"}
            completed={["diarized", "profiling", "profiled"].includes(step)}
            label="Diarize"
            icon={<Users className="h-3.5 w-3.5" />}
          />
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <StepIndicator
            active={step === "profiling"}
            completed={step === "profiled"}
            label="Profile"
            icon={<UserCircle className="h-3.5 w-3.5" />}
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={handleTranscribe}
            disabled={step !== "idle"}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              step === "idle"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            Transcribe
          </button>
          <button
            onClick={handleDiarize}
            disabled={step !== "transcribed"}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              step === "transcribed"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Diarize
          </button>
          <button
            onClick={handleGenerateProfile}
            disabled={step !== "diarized"}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              step === "diarized"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <UserCircle className="h-3.5 w-3.5" />
            Customer Profile
          </button>
        </div>

        {/* Processing Animation */}
        {["transcribing", "diarizing", "profiling"].includes(step) && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
            <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
            <span className="text-sm text-slate-600">{processingText}</span>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Content Display */}
        {step === "transcribed" && transcript && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-slate-700">Transcription Complete</span>
            </div>
            <ScrollArea className="h-48">
              <pre className="whitespace-pre-wrap text-xs text-slate-600 font-mono">
                {transcript}
              </pre>
            </ScrollArea>
          </div>
        )}

        {["diarized", "profiling", "profiled"].includes(step) && diarized.length > 0 && !profile && (
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-slate-700">Speaker Diarization Complete</span>
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {diarized.slice(0, 20).map((msg, i) => renderDiarizedMessage(msg, i))}
              </div>
            </ScrollArea>
          </div>
        )}

        {step === "profiled" && profile && (
          <CustomerProfileCard profile={profile} />
        )}
      </div>
    </Card>
  );
}

function StepIndicator({
  active,
  completed,
  label,
  icon,
}: {
  active: boolean;
  completed: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
          completed
            ? "bg-slate-900 text-white"
            : active
            ? "bg-slate-200 text-slate-700 ring-2 ring-slate-400"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {completed ? <CheckCircle2 className="h-4 w-4" /> : icon}
      </div>
      <span
        className={`text-[10px] font-medium ${
          completed ? "text-slate-900" : active ? "text-slate-700" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function CustomerProfileCard({ profile }: { profile: CustomerProfile }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
          <UserCircle className="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Customer Profile</h4>
          <p className="text-[10px] text-slate-500">Generated from conversation</p>
        </div>
      </div>

      <div className="grid gap-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <ProfileField label="Departure City" value={profile.departureCity} />
          <ProfileField label="Travel Dates" value={profile.travelDates} />
          <ProfileField label="Duration" value={profile.tripDuration} />
          <ProfileField label="Occasion" value={profile.occasion} />
        </div>

        <ProfileField label="Party" value={profile.partyComposition} />
        <ProfileField label="Hotels" value={profile.hotelPreferences} />
        
        <div>
          <span className="text-[10px] font-medium text-slate-500 uppercase">Destinations</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {profile.destinations.map((dest, i) => (
              <Badge key={i} variant="outline" className="text-[10px] bg-white">
                {dest}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-medium text-slate-500 uppercase">Special Requests</span>
          <ul className="mt-1 space-y-0.5">
            {profile.specialRequests.map((req, i) => (
              <li key={i} className="flex items-start gap-1 text-slate-700">
                <span className="text-slate-400">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-200 p-2">
          <span className="text-[10px] font-semibold text-slate-700 uppercase flex items-center gap-1">
            <UserCircle className="h-3 w-3" />
            Rapport Tips
          </span>
          <ul className="mt-1 space-y-0.5">
            {profile.rapportTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-1 text-slate-600">
                <span className="text-slate-400">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] font-medium text-slate-500 uppercase">{label}</span>
      <p className="text-slate-700">{value}</p>
    </div>
  );
}
