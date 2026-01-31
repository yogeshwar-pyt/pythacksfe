import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient();
    const { conversation } = await request.json();

    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json(
        { error: "Missing or invalid conversation data" },
        { status: 400 }
      );
    }

    if (!openai) {
      // Return mock profile when OpenAI is not configured
      return NextResponse.json({
        profile: generateMockProfile(conversation),
        source: "mock"
      });
    }

    const conversationText = conversation.join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert travel consultant analyst. Analyze the following diarized conversation between a travel agent and customer. Extract a comprehensive customer profile that will help agents build rapport and provide personalized service.

Return a JSON object with the following structure:
{
  "name": "Customer name if mentioned, otherwise 'Customer'",
  "departureCity": "City they're departing from",
  "travelDates": "Their planned travel dates",
  "tripDuration": "Duration of the trip",
  "partyComposition": "Who is traveling (e.g., 'Couple with 4-year-old daughter')",
  "occasion": "Special occasion if any (e.g., 'Anniversary')",
  "destinations": ["Array of destinations they want to visit"],
  "interests": ["Array of activities/interests they mentioned"],
  "hotelPreferences": "Their hotel preferences",
  "budgetIndicators": "Any budget indicators from the conversation",
  "specialRequests": ["Array of special requests or must-haves"],
  "communicationStyle": "Brief description of how they communicate",
  "rapportTips": ["Array of 5 specific tips for building rapport based on the conversation - these should be actionable insights for future calls"]
}

Be specific and extract actual details from the conversation. For rapportTips, focus on personal touches that show you remember the customer.`
        },
        {
          role: "user",
          content: `Analyze this conversation and create a customer profile:\n\n${conversationText}`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    try {
      const profile = JSON.parse(content);
      profile.createdAt = new Date().toISOString();
      
      return NextResponse.json({
        profile,
        source: "openai"
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Customer profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateMockProfile(conversation: string[]) {
  // Parse conversation to extract some basic info
  const conversationText = conversation.join(" ").toLowerCase();
  
  return {
    name: "Customer",
    departureCity: conversationText.includes("bangalore") ? "Bangalore" : "Unknown",
    travelDates: "April 21st - April 30th",
    tripDuration: "9 nights 10 days",
    partyComposition: "Couple with 4-year-old daughter",
    occasion: "Wedding Anniversary (25th)",
    destinations: ["Abu Dhabi (Yas Island)", "Dubai", "Palm Atlantis"],
    interests: [
      "Theme parks (Ferrari World, Warner Bros, Sea World)",
      "Kid-friendly activities (dolphin shows, mermaid shows)",
      "Luxury stay at Atlantis",
      "Cultural visits (BAPS temple, Grand Mosque)"
    ],
    hotelPreferences: "4-star in Dubai, Atlantis for anniversary night",
    budgetIndicators: "Premium segment - willing to spend on experiences",
    specialRequests: [
      "Must stay at Atlantis on 25th (anniversary)",
      "Emirates/Etihad flights only",
      "Child-friendly activities priority"
    ],
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
}
