"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserCircle,
  MapPin,
  Calendar,
  Users,
  Heart,
  Star,
  X,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

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

interface CustomerProfileViewProps {
  onDismiss: () => void;
}

export function CustomerProfileView({ onDismiss }: CustomerProfileViewProps) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("customerProfile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to load profile:", e);
      }
    }
  }, []);

  if (!profile) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white p-8 text-center">
        <UserCircle className="mb-4 h-12 w-12 text-slate-300" />
        <h3 className="mb-2 text-lg font-medium text-slate-700">No Customer Profile</h3>
        <p className="mb-4 text-sm text-slate-500">
          Process a call recording first to generate customer insights
        </p>
        <button
          onClick={onDismiss}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Continue to Call
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <UserCircle className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Customer Profile</h2>
            <p className="text-xs text-slate-500">Review before starting the call</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Start Call
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Quick Info Grid */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <InfoCard icon={<MapPin className="h-4 w-4" />} label="Departure" value={profile.departureCity} />
            <InfoCard icon={<Calendar className="h-4 w-4" />} label="Travel Dates" value={profile.travelDates} />
            <InfoCard icon={<Users className="h-4 w-4" />} label="Travelers" value={profile.partyComposition} />
            <InfoCard icon={<Heart className="h-4 w-4" />} label="Occasion" value={profile.occasion} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Destinations */}
              <Section title="Destinations">
                <div className="flex flex-wrap gap-2">
                  {profile.destinations.map((dest, i) => (
                    <Badge key={i} variant="outline" className="bg-slate-50 text-slate-700">
                      {dest}
                    </Badge>
                  ))}
                </div>
              </Section>

              {/* Interests */}
              <Section title="Interests">
                <ul className="space-y-1.5">
                  {profile.interests.map((interest, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-400">•</span>
                      {interest}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Hotel Preferences */}
              <Section title="Hotel Preferences">
                <p className="text-sm text-slate-600">{profile.hotelPreferences}</p>
              </Section>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Special Requests */}
              <Section title="Special Requests">
                <ul className="space-y-1.5">
                  {profile.specialRequests.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                      {req}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Rapport Tips - Highlighted */}
              <div className="rounded-lg bg-slate-900 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-medium text-white">Rapport Tips</h3>
                </div>
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
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-medium text-slate-800 truncate" title={value}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-800">{title}</h3>
      {children}
    </div>
  );
}
