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
    
    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 503 }
      );
    }
    
    const { itinerary } = await request.json();

    if (!itinerary) {
      return NextResponse.json(
        { error: "Missing itinerary data" },
        { status: 400 }
      );
    }

    // Parse the itinerary to understand it better
    let itineraryData;
    try {
      itineraryData = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: `You are a travel operations expert. Analyze the provided itinerary and generate EXACTLY 5 ITINERARY-SPECIFIC items that the customer MUST know about their trip.

IMPORTANT RULES:
1. DO NOT include generic items that are already covered in the standard checklist (provided in existingItems)
2. Focus ONLY on things specific to THIS itinerary - the destinations, activities, hotels, and dates
3. Each item should be something the customer needs to know BEFORE or DURING this specific trip

Generate items about:
- Specific activity requirements (e.g., "Mount Batur sunrise trek requires 2 AM pickup - wear warm layers and hiking shoes")
- Temple dress codes and cultural etiquette for visited temples
- Specific transfer/intercity travel notes (e.g., "Ubud to Seminyak transfer takes approximately 1.5 hours through traffic")
- Weather considerations for the travel dates
- Specific restaurant/meal recommendations at destinations
- Local currency and tipping customs for the region
- Specific attraction tips (best photo spots, crowd avoidance, must-see areas)
- Activity-specific items to bring or avoid
- Health/safety tips specific to activities (e.g., motion sickness for boat rides, altitude for treks)

DO NOT generate items about:
- Generic voucher information
- Generic document requirements  
- Generic baggage allowance
- Generic hotel check-in/out times
- Generic support contact hours
- Anything already in the existingItems list

Return ONLY a JSON array of EXACTLY 5 strings. Be SPECIFIC to this itinerary. Format: ["Specific item 1", "Specific item 2", ...]`
        },
        {
          role: "user",
          content: `Analyze this itinerary and generate 5 SPECIFIC items the customer must know (avoid duplicating existingItems):\n\n${JSON.stringify(itineraryData, null, 2)}`
        }
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Extract JSON array from the response
    let items: string[];
    try {
      // Try to parse as JSON directly
      items = JSON.parse(content);
    } catch {
      // If that fails, try to extract JSON array from markdown code blocks
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        items = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines and clean up
        items = content
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .map((line: string) => line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim())
          .filter((line: string) => line.length > 0);
      }
    }

    return NextResponse.json({
      items,
      model: "gpt-4o-mini",
      tokens: completion.usage?.total_tokens || 0,
    });

  } catch (error) {
    console.error("Generate niner error:", error);
    return NextResponse.json(
      { error: "Failed to generate niner items" },
      { status: 500 }
    );
  }
}
