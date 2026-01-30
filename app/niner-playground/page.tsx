"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { Loader2, Sparkles, Upload, FileJson, Plane, Hotel, MapPin, Calendar, Clock, Utensils, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ItineraryData {
  name?: string;
  resortImages?: string[];
  cityHotelStay?: Array<{
    cityName: string;
    hotelName: string;
    nights: number;
    mealTypeEnum?: string;
  }>;
  itineraryBlocks?: Array<{
    blockType: string;
    cityBlock?: {
      cityId: number;
      dayPlans?: Array<{
        dayNum: number;
        stay: boolean;
        slotPlans?: Array<{
          slotName: string;
          actionType: string;
          arrivalSlotActionDetail?: {
            arrivalAirportCode?: string;
            meetingPointTransfer?: {
              transferType?: string;
            };
          };
          activitySlotActionDetail?: {
            activityId?: number;
            startTime?: string;
            onwardPickupTime?: string;
            returnPickupTime?: string;
            transferIncluded?: boolean;
          };
        }>;
      }>;
    };
  }>;
  userSearchDetail?: {
    region?: string;
    minDays?: number;
    maxDays?: number;
  };
}

export default function NinerPlayground() {
  const [itineraryJson, setItineraryJson] = useState("");
  const [parsedItinerary, setParsedItinerary] = useState<ItineraryData | null>(null);
  const [generatedItems, setGeneratedItems] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-load iti.json on mount
  useEffect(() => {
    const loadItinerary = async () => {
      try {
        const response = await fetch('/iti.json');
        if (!response.ok) {
          console.error('Failed to fetch iti.json:', response.status);
          setError('Failed to load itinerary file');
          return;
        }
        
        let text = await response.text();
        console.log('Loaded iti.json, length:', text.length);
        
        // Clean MongoDB export format - more aggressive
        text = text
          .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '') // Remove comments
          .replace(/ObjectId\s*\(\s*"([^"]+)"\s*\)/g, '"$1"') // ObjectId("...") -> "..."
          .replace(/NumberLong\s*\(\s*(-?\d+)\s*\)/g, '$1') // NumberLong(123) -> 123
          .replace(/NumberLong\s*\(\s*"(-?\d+)"\s*\)/g, '$1') // NumberLong("123") -> 123
          .replace(/ISODate\s*\(\s*"([^"]+)"\s*\)/g, '"$1"') // ISODate("...") -> "..."
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .trim();
        
        // Parse and prettify
        const parsed = JSON.parse(text);
        console.log('Parsed itinerary:', parsed);
        console.log('Has itineraryBlocks:', !!parsed.itineraryBlocks);
        
        const prettified = JSON.stringify(parsed, null, 2);
        
        setItineraryJson(prettified);
        setParsedItinerary(parsed);
      } catch (err) {
        console.error('Failed to load iti.json:', err);
        setError('Failed to parse itinerary: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    };
    
    loadItinerary();
  }, []);

  const existingNinerItems = [
    "Check Passports, Custom Cards etc",
    "Verify passenger count (adults, children, infants)",
    "Does the itinerary planning and city routing need additional/unnecessary travel?",
    "Check for Amenities - Breakfast/Wifi/Elevator/Air conditioning",
    "Twin beds should not be given for couples. Check and place email request for Double beds",
    "If room size lesser than 190 Sq ft - Communicate to customer",
    "Hotel check-in dates to be checked with Flight booking and itinerary",
    "If hotel is not in city centre - Booking to be amended or communicated",
    "If bathroom type is shared - Booking to be amended or communicated",
    "City tax/Caution deposit communicated to Customer",
    "Baggage allowance clearly stated",
    "Visa requirements and processing times",
    "Travel insurance coverage details",
    "Activity pickup times and meeting points",
    "Meal inclusions and dietary restrictions",
    "Cancellation and refund policies",
    "Emergency contact numbers",
    "Currency exchange information",
    "Local customs and etiquette",
    "Weather conditions and packing suggestions"
  ];

  // Activity ID to name mapping
  const activityNames: Record<number, string> = {
    520394: "Dubai Marina Dhow Cruise with Dinner",
    551195: "Dubai City Tour with Burj Khalifa",
    520508: "Desert Safari with BBQ Dinner",
  };

  const getMealType = (code?: string) => {
    const meals: Record<string, string> = {
      'BB': 'Bed & Breakfast',
      'HB': 'Half Board',
      'FB': 'Full Board',
      'AI': 'All Inclusive',
      'RO': 'Room Only',
    };
    return code ? meals[code] || code : 'Not specified';
  };

  const handleGenerateNiner = async () => {
    if (!itineraryJson.trim()) {
      setError("Please paste an itinerary JSON first");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Clean and validate JSON
      let cleanJson = itineraryJson
        .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '')
        .replace(/ObjectId\(("[^"]+")\)/g, '$1')
        .replace(/NumberLong\((\d+)\)/g, '$1')
        .trim();
      
      JSON.parse(cleanJson);

      const response = await fetch("/api/generate-niner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itinerary: cleanJson }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate niner items");
      }

      const data = await response.json();
      setGeneratedItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON or generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setItineraryJson(content);
        try {
          setParsedItinerary(JSON.parse(content));
        } catch {
          // Invalid JSON
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <AppHeader pageTitle="Niner Playground" />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Itinerary Preview */}
        <div className="flex w-1/2 flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              {parsedItinerary?.name || "Dubai Trip Itinerary"}
            </h2>
            <p className="text-xs text-slate-500">
              {parsedItinerary?.userSearchDetail?.minDays} days trip to {parsedItinerary?.cityHotelStay?.[0]?.cityName || "Dubai"}
            </p>
          </div>

          <ScrollArea className="flex-1 px-6 py-4">
            {parsedItinerary && parsedItinerary.itineraryBlocks && parsedItinerary.itineraryBlocks.length > 0 ? (
              <div className="space-y-6 pr-3">
                {/* Trip Images */}
                {parsedItinerary.resortImages && parsedItinerary.resortImages.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-slate-600" />
                      <h3 className="text-sm font-semibold text-slate-900">Trip Gallery</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {parsedItinerary.resortImages.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="relative aspect-video overflow-hidden rounded-lg border border-slate-200">
                          <img 
                            src={img} 
                            alt={`Trip image ${idx + 1}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="14" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hotel Details */}
                {parsedItinerary.cityHotelStay && parsedItinerary.cityHotelStay.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Hotel className="h-4 w-4 text-slate-600" />
                      <h3 className="text-sm font-semibold text-slate-900">Accommodation</h3>
                    </div>
                    {parsedItinerary.cityHotelStay.map((hotel, idx) => (
                      <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-slate-900">{hotel.hotelName}</h4>
                            <p className="mt-1 text-xs text-slate-600">{hotel.cityName}</p>
                            <div className="mt-2 flex items-center gap-3">
                              <Badge variant="outline" className="text-xs">
                                {hotel.nights} nights
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <Utensils className="h-3 w-3" />
                                {getMealType(hotel.mealTypeEnum)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Day by Day Itinerary */}
                {parsedItinerary.itineraryBlocks.map((block, blockIndex) => {
                  if (block.blockType === "CITY" && block.cityBlock) {
                    const cityBlock = block.cityBlock;
                    const getCityName = (cityId: number) => {
                      const cities: Record<number, string> = { 20: "Dubai", 7: "Abu Dhabi", 1: "Bangkok" };
                      return cities[cityId] || `City ${cityId}`;
                    };

                    return (
                      <div key={blockIndex} className="space-y-3">
                        <div className="flex items-center gap-2 pb-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <h3 className="text-base font-semibold text-slate-900">
                            {getCityName(cityBlock.cityId)}
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {cityBlock.dayPlans?.map((day, dayIndex) => (
                            <div key={dayIndex} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                              <div className="mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-600" />
                                <span className="text-sm font-semibold text-slate-900">Day {day.dayNum}</span>
                              </div>

                              <div className="space-y-2.5">
                                {day.slotPlans?.map((slot, slotIndex) => {
                                  const getActionIcon = (type: string) => {
                                    if (type === "INTERNATIONAL_ARRIVE" || type === "INTERNATIONAL_DEPART") return <Plane className="h-4 w-4 text-orange-600" />;
                                    if (type === "ACTIVITY") return <Sparkles className="h-4 w-4 text-purple-600" />;
                                    if (type === "LEISURE") return <Hotel className="h-4 w-4 text-green-600" />;
                                    return null;
                                  };

                                  const getActionText = (slot: any) => {
                                    if (slot.actionType === "INTERNATIONAL_ARRIVE") {
                                      return `Arrival at ${slot.arrivalSlotActionDetail?.arrivalAirportCode || "Airport"} - ${slot.arrivalSlotActionDetail?.meetingPointTransfer?.transferType || "Transfer"}`;
                                    }
                                    if (slot.actionType === "ACTIVITY") {
                                      const activityId = slot.activitySlotActionDetail?.activityId;
                                      const activityName = activityId ? (activityNames[activityId] || `Activity #${activityId}`) : "Activity";
                                      const transfer = slot.activitySlotActionDetail?.transferIncluded ? " (Transfer included)" : " (No transfer)";
                                      return activityName + transfer;
                                    }
                                    if (slot.actionType === "LEISURE") {
                                      return "Free time to explore on your own";
                                    }
                                    return slot.actionType;
                                  };

                                  return (
                                    <div key={slotIndex} className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-3">
                                      <div className="mt-0.5">{getActionIcon(slot.actionType)}</div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs font-medium">
                                            {slot.slotName}
                                          </Badge>
                                          {slot.activitySlotActionDetail?.startTime && (
                                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                              <Clock className="h-3 w-3" />
                                              {slot.activitySlotActionDetail.startTime}
                                            </span>
                                          )}
                                        </div>
                                        <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{getActionText(slot)}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
                  <p className="mt-3 text-sm text-slate-500">Loading itinerary...</p>
                  {parsedItinerary && !parsedItinerary.itineraryBlocks && (
                    <p className="mt-2 text-xs text-red-500">No itinerary blocks found</p>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="border-t border-slate-200 p-4">
            {error && (
              <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerateNiner}
              disabled={isGenerating || !itineraryJson.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Niner Items
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results Section */}
        <div className="flex w-1/2 flex-col bg-slate-50">
          <div className="border-b border-slate-200 bg-white px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Analysis Results</h2>
            <p className="text-xs text-slate-500">
              Critical points to communicate to customers
            </p>
          </div>

          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4 pr-3">
              {/* Existing Items Reference */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-slate-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Standard Template</h3>
                  <Badge variant="secondary" className="text-xs">{existingNinerItems.length} items</Badge>
                </div>
                <div className="space-y-1.5">
                  {existingNinerItems.slice(0, 8).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-slate-400">{index + 1}.</span>
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                  {existingNinerItems.length > 8 && (
                    <div className="px-3 py-2 text-center text-xs text-slate-400">
                      +{existingNinerItems.length - 8} more items
                    </div>
                  )}
                </div>
              </div>

              {/* Generated Items */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-slate-900">AI-Generated Items</h3>
                  {generatedItems.length > 0 && (
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs">
                      {generatedItems.length} items
                    </Badge>
                  )}
                </div>
                {generatedItems.length === 0 ? (
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12">
                    <p className="text-sm text-slate-400">
                      Click "Generate Niner Items" to analyze
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {generatedItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 rounded-md border border-purple-200 bg-purple-50 px-3 py-2.5 text-sm"
                      >
                        <span className="font-semibold text-purple-600">{index + 1}.</span>
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
