"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles,
  CheckCircle2,
  Circle,
  Loader2,
  MapPin,
  Calendar,
  Users,
  Plane,
  Clock,
  Sun,
  Sunset,
  Coffee,
  Car,
  Image as ImageIcon
} from "lucide-react";

// Standard template items from email template
const TEMPLATE_ITEMS = [
  { id: "1", text: "Vouchers are live and ready on the Pickyourtrail app" },
  { id: "2", text: "Documents to carry: Original passports with printed copies, flight tickets, hotel vouchers, colored visa printouts, travel insurance if opted" },
  { id: "3", text: "Baggage allowance: Check airline specific limits for checked and cabin baggage" },
  { id: "4", text: "Hotel check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in and late checkout usually not available" },
  { id: "5", text: "Activity timings will be shared 1 day in advance. Driver numbers shared 1 hour before pickup time" },
  { id: "6", text: "All transfers are on shared basis unless upgraded to private at extra cost" },
  { id: "7", text: "Airport arrival: Driver will be in arrivals hall with placard showing your name" },
  { id: "8", text: "Transfer waiting time: 5 minutes for shared transfers, 10 minutes for private transfers" },
  { id: "9", text: "24/7 live chat support on app starts 3 days before your trip" },
  { id: "10", text: "Contact hours: Available 10 AM to 7 PM for any assistance" },
];

// City ID to name mapping
const CITY_NAMES: Record<number, string> = {
  20: "Dubai",
  41: "Bali",
  71: "Ubud",
  79: "Seminyak",
  295: "Kuta",
};

// Activity ID to name mapping
const ACTIVITY_NAMES: Record<number, string> = {
  506393: "Ubud Rice Terraces Tour",
  368388: "Tirta Empul Temple Visit",
  519102: "Mount Batur Sunrise Trek",
  150697: "Ubud Art & Culture Tour",
  510914: "Tegallalang Rice Terrace",
  300047: "Tanah Lot Temple Sunset",
  488930: "Seminyak Beach Club",
  665878: "Uluwatu Temple & Kecak Dance",
  520394: "Dhow Cruise with Dinner",
  551195: "Dubai City Tour",
  520508: "Desert Safari with BBQ Dinner",
};

// Gallery images for Bali
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=300&fit=crop",
];

interface SlotPlan {
  slotName: string;
  actionType: string;
  activitySlotActionDetail?: { 
    activityId: number; 
    startTime: string;
    intercityTransferSlotActionDetail?: {
      fromCityId: number;
      toCityId: number;
    };
  };
  arrivalSlotActionDetail?: { arrivalAirportCode: string };
  departureSlotActionDetail?: { departureAirportCode: string };
}

interface DayPlan {
  dayNum: number;
  stay: boolean;
  slotPlans: SlotPlan[];
}

interface CityBlock {
  cityId: number;
  dayPlans: DayPlan[];
}

interface ItineraryBlock {
  blockType: string;
  cityBlock?: CityBlock;
}

interface ItineraryData {
  name?: string;
  tripId: string;
  resortImages?: string[];
  costingKeyObject: {
    costingConfiguration: {
      departureAirport: string;
      departureDate: string;
      nights: number;
      tripType: string;
      hotelGuestRoomConfigurations: Array<{ adultCount: number; childAges: number[] }>;
    };
  };
  userSearchDetail?: {
    region: string;
    minDays: number;
    maxDays: number;
  };
  itineraryBlocks: ItineraryBlock[];
}

function parseItineraryJson(text: string): ItineraryData | null {
  try {
    let cleaned = text
      .replace(/ObjectId\("([^"]+)"\)/g, '"$1"')
      .replace(/NumberLong\(([^)]+)\)/g, '$1')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    return JSON.parse(cleaned);
  } catch (e) { 
    console.error("Parse error:", e);
    return null; 
  }
}

function getSlotIcon(slotName: string) {
  switch (slotName) {
    case "MORNING": return <Sun className="h-3 w-3" />;
    case "NOON": return <Coffee className="h-3 w-3" />;
    case "EVENING": return <Sunset className="h-3 w-3" />;
    default: return <Clock className="h-3 w-3" />;
  }
}

function getActionLabel(actionType: string, detail?: { activityId?: number; intercityTransferSlotActionDetail?: { fromCityId: number; toCityId: number } }) {
  switch (actionType) {
    case "INTERNATIONAL_ARRIVE": return "✈️ Arrival";
    case "INTERNATIONAL_DEPART": return "✈️ Departure";
    case "ACTIVITY": return ACTIVITY_NAMES[detail?.activityId || 0] || "Activity";
    case "ACTIVITY_WITH_TRANSFER": 
      const transfer = detail?.intercityTransferSlotActionDetail;
      const activityName = ACTIVITY_NAMES[detail?.activityId || 0] || "Activity";
      if (transfer) {
        return `🚗 ${CITY_NAMES[transfer.fromCityId] || ""} → ${CITY_NAMES[transfer.toCityId] || ""} + ${activityName}`;
      }
      return activityName;
    case "LEISURE": return "Leisure Time";
    default: return actionType;
  }
}

function getTotalDays(blocks: ItineraryBlock[]): number {
  let maxDay = 0;
  blocks.forEach(block => {
    block.cityBlock?.dayPlans.forEach(day => {
      if (day.dayNum > maxDay) maxDay = day.dayNum;
    });
  });
  return maxDay;
}

function getCities(blocks: ItineraryBlock[]): string[] {
  return blocks
    .filter(b => b.cityBlock)
    .map(b => CITY_NAMES[b.cityBlock!.cityId] || `City ${b.cityBlock!.cityId}`);
}

export default function NinerPlayground() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [generatedItems, setGeneratedItems] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/itilong.json")
      .then(res => res.text())
      .then(text => {
        const parsed = parseItineraryJson(text);
        setItinerary(parsed);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Fetch error:", e);
        setIsLoading(false);
      });
  }, []);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-niner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          itinerary: JSON.stringify({
            itineraryData: itinerary,
            existingItems: TEMPLATE_ITEMS.map(i => i.text)
          })
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to generate:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const completedCount = checkedItems.length;
  const config = itinerary?.costingKeyObject?.costingConfiguration;
  const blocks = itinerary?.itineraryBlocks || [];
  const totalDays = getTotalDays(blocks);
  const cities = getCities(blocks);
  const images = itinerary?.resortImages?.length ? itinerary.resortImages : GALLERY_IMAGES;

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Simple Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Niner Checklist</h1>
          <p className="text-xs text-slate-500">Pre-call preparation & AI-generated items</p>
        </div>
        <span className="text-xs text-slate-500 border border-slate-200 rounded-full px-2.5 py-0.5">
          {completedCount}/{TEMPLATE_ITEMS.length} Ready
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Itinerary */}
        <div className="flex w-1/2 flex-col border-r border-slate-200">
          <div className="border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-medium text-slate-700">Itinerary Overview</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : itinerary ? (
              <div className="p-5 space-y-5">
                {/* Gallery */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Gallery</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(0, 4).map((img, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard icon={<Plane className="h-4 w-4" />} label="From" value={config?.departureAirport || "N/A"} />
                  <InfoCard icon={<Calendar className="h-4 w-4" />} label="Start Date" value={config?.departureDate || "N/A"} />
                  <InfoCard icon={<Clock className="h-4 w-4" />} label="Duration" value={`${totalDays} Days`} />
                  <InfoCard icon={<Users className="h-4 w-4" />} label="Trip Type" value={config?.tripType || "N/A"} />
                </div>

                {/* Cities Route */}
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-2">Route</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {cities.map((city, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span className="text-xs font-medium text-white">{city}</span>
                        </div>
                        {i < cities.length - 1 && <Car className="h-3 w-3 text-slate-300" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day-wise Plan by City */}
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-2">Day-wise Plan</p>
                  <div className="space-y-4">
                    {blocks.map((block, blockIdx) => {
                      if (!block.cityBlock) return null;
                      const cityName = CITY_NAMES[block.cityBlock.cityId] || `City ${block.cityBlock.cityId}`;
                      return (
                        <div key={blockIdx}>
                          {/* City Header */}
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-3 w-3 text-slate-500" />
                            <span className="text-xs font-medium text-slate-700">{cityName}</span>
                            <span className="text-[10px] text-slate-400">({block.cityBlock.dayPlans.length} days)</span>
                          </div>
                          
                          {/* Days */}
                          <div className="space-y-1.5 ml-5">
                            {block.cityBlock.dayPlans.map((day) => (
                              <div key={day.dayNum} className="rounded-lg border border-slate-200 bg-white p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                                    D{day.dayNum}
                                  </span>
                                  {day.stay && <span className="text-[10px] text-slate-400 ml-auto">🏨 Stay</span>}
                                </div>
                                <div className="space-y-1 pl-8">
                                  {day.slotPlans.map((slot, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                      <span className="text-slate-400">{getSlotIcon(slot.slotName)}</span>
                                      <span className={`flex-1 ${slot.actionType === "LEISURE" ? "text-slate-400 italic" : "text-slate-700"}`}>
                                        {getActionLabel(slot.actionType, slot.activitySlotActionDetail)}
                                      </span>
                                      {slot.activitySlotActionDetail?.startTime && (
                                        <span className="text-[10px] text-slate-400">{slot.activitySlotActionDetail.startTime}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-slate-400">No itinerary data found</div>
            )}
          </div>
        </div>

        {/* Right Panel - Checklist */}
        <div className="flex w-1/2 flex-col bg-slate-50">
          <div className="border-b border-slate-200 bg-white px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-500" />
                <h2 className="text-sm font-medium text-slate-700">Standard Checklist</h2>
              </div>
              <span className="text-xs text-slate-400">{TEMPLATE_ITEMS.length} items</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-4">
              {/* Template Items */}
              <div className="space-y-1.5">
                {TEMPLATE_ITEMS.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`w-full text-left rounded-lg border p-3 transition-all ${
                      checkedItems.includes(item.id)
                        ? "border-slate-300 bg-slate-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {checkedItems.includes(item.id) ? (
                          <CheckCircle2 className="h-4 w-4 text-slate-600" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-medium text-slate-400">{index + 1}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${
                          checkedItems.includes(item.id) ? "text-slate-500" : "text-slate-700"
                        }`}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Generated Items */}
              {generatedItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-slate-500" />
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">AI Generated</p>
                    <span className="text-[10px] border border-slate-200 rounded-full px-2 py-0.5">{generatedItems.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {generatedItems.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs leading-relaxed text-slate-700">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Generate Button */}
          <div className="border-t border-slate-200 bg-white p-4 space-y-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !itinerary}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate from Itinerary
                </>
              )}
            </button>
            <button
              onClick={() => setCheckedItems(TEMPLATE_ITEMS.map(i => i.id))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Mark All Ready
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-slate-400">{icon}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xs font-medium text-slate-700">{value}</p>
    </div>
  );
}
