import { NextRequest, NextResponse } from "next/server";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ValidationResult {
  completedItems: string[]; // IDs of items that have been covered
  reasoning: Record<string, string>; // ID -> explanation for why it's considered covered
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      checklistItems,
      transcriptHistory,
      callId,
    }: {
      checklistItems: ChecklistItem[];
      transcriptHistory: string;
      callId: string;
    } = body;

    if (!checklistItems || !transcriptHistory) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Filter only uncompleted items to check
    const uncompleted = checklistItems.filter((item) => !item.completed);

    if (uncompleted.length === 0) {
      return NextResponse.json({
        completedItems: [],
        reasoning: {},
        callId,
      });
    }

    // Build the prompt for GPT-4o-mini
    const checklistForPrompt = uncompleted
      .map((item) => `ID: ${item.id} | ${item.text}`)
      .join("\n");

    const systemPrompt = `You are a lenient call quality checker. Your task is to verify if topics from a checklist were discussed during the call.

SIMPLE RULE: If the TOPIC was mentioned or discussed, mark it COMPLETE. You don't need exact words or numbers.

EXAMPLES:

✅ MARK COMPLETE:
- Checklist: "Greet customer warmly" → Any greeting like "Hi", "Hello", "Good morning" = COMPLETE
- Checklist: "Confirm travel dates" → Any mention of dates, trip timing, when they're going = COMPLETE  
- Checklist: "Documents to carry" → Any mention of passport, tickets, vouchers, documents = COMPLETE
- Checklist: "Hotel check-in 2 PM" → Any mention of check-in time or hotel arrival = COMPLETE
- Checklist: "Flight details and baggage" → Any mention of flight, airline, or luggage = COMPLETE
- Checklist: "Ask if customer has questions" → Any "do you have questions?" or "anything else?" = COMPLETE

❌ DON'T MARK:
- If the topic was never mentioned at all in the conversation

BE GENEROUS. If the agent touched on the subject at all, mark it complete.

Respond in JSON format only:
{
  "completedItems": ["id1", "id2"],
  "reasoning": {
    "id1": "Topic was discussed when...",
    "id2": "Mentioned during..."
  }
}`;

    const userPrompt = `Transcript:
---
${transcriptHistory}
---

Checklist items to check:
${checklistForPrompt}

Which topics were discussed? Be generous - if the subject was touched on, mark it complete.`;


    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: response.status }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({
        completedItems: [],
        reasoning: {},
        callId,
      });
    }

    try {
      const parsed: ValidationResult = JSON.parse(content);
      return NextResponse.json({
        ...parsed,
        callId,
      });
    } catch {
      console.error("Failed to parse OpenAI response:", content);
      return NextResponse.json({
        completedItems: [],
        reasoning: {},
        callId,
      });
    }
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
