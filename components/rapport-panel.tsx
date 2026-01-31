"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
  Loader2,
  Lightbulb,
} from "lucide-react";

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

interface RapportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RapportPanel({ isOpen, onClose }: RapportPanelProps) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Load profile from localStorage
      const savedProfile = localStorage.getItem("customerProfile");
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Failed to load profile:", e);
        }
      }
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="relative max-h-[85vh] w-[500px] overflow-hidden bg-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
              <UserCircle className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Customer Rapport
              </h2>
              <p className="text-sm text-slate-500">
                Personalized insights for building connection
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(85vh-80px)]">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : profile ? (
            <div className="p-5 space-y-4">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  icon={<MapPin className="h-4 w-4 text-blue-500" />}
                  label="From"
                  value={profile.departureCity}
                />
                <InfoCard
                  icon={<Calendar className="h-4 w-4 text-green-500" />}
                  label="Travel"
                  value={profile.travelDates}
                />
                <InfoCard
                  icon={<Users className="h-4 w-4 text-purple-500" />}
                  label="Party"
                  value={profile.partyComposition}
                />
                <InfoCard
                  icon={<Heart className="h-4 w-4 text-rose-500" />}
                  label="Occasion"
                  value={profile.occasion}
                />
              </div>

              {/* Rapport Tips - Most Important */}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-800">
                    Rapport Building Tips
                  </h3>
                </div>
                <ul className="space-y-2">
                  {profile.rapportTips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <Star className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Destinations */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Destinations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.destinations.map((dest, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-white text-slate-700 border-slate-200"
                    >
                      {dest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Interests & Activities
                </h4>
                <ul className="space-y-1">
                  {profile.interests.map((interest, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="text-slate-400">•</span>
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Special Requests */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Special Requests
                </h4>
                <ul className="space-y-1">
                  {profile.specialRequests.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="text-slate-400">★</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Hotel Preferences
                  </h4>
                  <p className="text-sm text-slate-700">{profile.hotelPreferences}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Communication Style
                  </h4>
                  <p className="text-sm text-slate-700">{profile.communicationStyle}</p>
                </div>
              </div>

              {/* Budget Indicator */}
              <div className="rounded-lg bg-slate-50 p-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Budget Indicators
                </h4>
                <p className="text-sm text-slate-700">{profile.budgetIndicators}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <UserCircle className="h-12 w-12 text-slate-300 mb-3" />
              <h3 className="font-semibold text-slate-700 mb-1">
                No Customer Profile Found
              </h3>
              <p className="text-sm text-slate-500">
                Process a call transcription first to generate a customer profile
                for rapport building.
              </p>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className="text-sm font-medium text-slate-800 truncate" title={value}>
        {value}
      </p>
    </div>
  );
}
