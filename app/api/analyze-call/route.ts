
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
    
    const { transcript, checklist } = await request.json();

    if (!transcript || !checklist) {
      return NextResponse.json(
        { error: "Missing transcript or checklist data" },
        { status: 400 }
      );
    }

    // Format transcript
    const transcriptText = Array.isArray(transcript) 
      ? transcript.map((t: any) => `[${t.timestamp || '00:00'}] ${t.text}`).join('\n')
      : String(transcript);

    // Format checklist
    const checklistText = checklist.map((item: any) => `- [${item.id}] ${item.text}`).join('\n');

    const systemPrompt = `You are a strict QA auditor for travel briefing calls. Analyze the call transcript against the required checklist.

Your goal is to output a JSON object matching this structure:
{
  "conveyed_items": [
    { "category": "Category Name", "item": "Checklist Item Text", "quote": "Exact quote from transcript", "timestamp": "00:00" }
  ],
  "missed_items": [
    { "category": "Category Name", "item": "Checklist Item Text", "importance": "High/Medium/Low", "recommendation": "What should have been said" }
  ],
  "tasks": [
    { "task": "Action item", "owner": "Agent/Customer", "deadline": "Asap/Date", "context": "Why this task exists" }
  ],
  "insights": {
    "call_quality": "Excellent/Good/Average/Poor",
    "customer_sentiment": "Positive/Neutral/Anxious/Angry",
    "salesperson_performance": "Confidence/Knowledge assessment",
    "areas_of_concern": ["Concern 1", "Concern 2"],
    "positive_highlights": ["Highlight 1", "Highlight 2"],
    "overall_summary": "Brief summary of the call"
  },
  "compliance_score": {
    "total_mandatory_items": number,
    "items_conveyed": number,
    "items_missed": number,
    "percentage": number, // 0-100
    "rating": "Excellent/Good/Needs Improvement"
  }
}

INSTRUCTIONS:
1. "conveyed_items": Only include items where the agent clearly covered the topic. Use EXACT quotes from the transcript using the timestamp if available.
2. "missed_items": Include any checklist items NOT covered.
3. "tasks": Extract any promises made by the agent (e.g., "I will email you the voucher") or tasks for the customer.
4. "compliance_score": specific to the checklist coverage.
5. BE CRITICAL. If it wasn't said, it's missed.

TRANSCRIPT:
${transcriptText.substring(0, 15000)} // Limit context if needed

CHECKLIST:
${checklistText}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that outputs JSON." },
        { role: "user", content: systemPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2, // Low temperature for consistent analysis
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    const analysisResult = JSON.parse(content);

    // Add processing metadata
    const finalResponse = {
      ...analysisResult,
      processing_time_seconds: 2.5,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error("Error analyzing call:", error);
    return NextResponse.json(
      { error: "Failed to analyze call" },
      { status: 500 }
    );
  }
}
