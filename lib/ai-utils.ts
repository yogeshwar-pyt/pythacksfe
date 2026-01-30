/**
 * AI utility functions for generating call coaching guidance
 * These functions process email and chat context into natural spoken guidance
 */

export interface ChatSummary {
  trip_overview: string;
  known_preferences: string[];
  concerns_raised: string[];
  processing_time_seconds: number;
  timestamp: string;
}

export interface CallCoachingGuidance {
  narrative: string[];
  chatSummary: ChatSummary;
}

/**
 * Generate call coaching narrative from email and chat context
 * In production, this would call an AI service (OpenAI, Claude, etc.)
 */
export function generateCallGuidance(
  emailContent: string,
  chatMessages?: Array<{ sender: string; content: string; timestamp?: string }>
): CallCoachingGuidance {
  // Mock AI coaching generation - In production, replace with actual AI API call
  const text = stripHtml(emailContent);
  const chatContext = chatMessages 
    ? chatMessages.map(m => `${m.sender}: ${m.content}`).join('\n')
    : '';
  
  // Generate natural coaching narrative
  const narrative = generateCoachingNarrative(text, chatContext);
  
  // Generate chat summary from team messages
  const chatSummary = generateChatSummary(chatMessages || []);
  
  return {
    narrative,
    chatSummary,
  };
}

// Helper functions

function stripHtml(html: string): string {
  // Simple HTML stripping - in production use a proper library
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateCoachingNarrative(emailText: string, chatContext: string): string[] {
  // Mock coaching narrative generation
  // In production, this would use AI to generate natural guidance
  
  const isDubaiTrip = emailText.toLowerCase().includes('dubai') || 
                       emailText.toLowerCase().includes('emirates');
  
  if (isDubaiTrip) {
    return [
      "Confirm vouchers are live and ready on Pickyourtrail app",
      "Documents to carry: Original passports + printed copies, flight tickets, hotel vouchers, colored visa copies, travel insurance (if opted)",
      "Emirates Airlines: 30 kg checked baggage, 7 kg cabin baggage per person",
      "Hotel check-in: 2 PM | Check-out: 12 PM (early/late not usually available)",
      "Tourism Dirham Fee: AED 7-20 per room/night - payable on arrival, non-refundable",
      "Activity timings shared 1 day in advance. Driver numbers 1 hour before pickup",
      "All transfers are shared basis unless upgraded to private",
      "Desert Safari & Dhow Cruise: Vegetarian food limited. No dune bashing for infants/seniors/pregnant women",
      "Burj Khalifa combo ticket: Redeem at counter in Dubai Mall, arrive 30 mins before slot",
      "BAPS Mandir: Register online 1 day prior at mandir.ae/visit. Passport required. Closed Mondays",
      "Airport transfers: Driver with name placard in arrivals hall",
      "Abu Dhabi Airport shuttle to Dubai: Driver meets at XNB Etihad Travel Mall",
      "Transfer waiting time: Shared 5 mins, Private 10 mins. No stops between",
      "24/7 live chat on app starts 3 days before trip. No WhatsApp support",
      "Confirm all questions answered. Available 10 AM - 7 PM for assistance"
    ];
  }
  
  // Fallback generic coaching
  return [
    "Begin by confirming the customer's booking details and ensuring they have access to their vouchers. Speak clearly and warmly to set a positive tone for the call.",
    
    "Walk through any essential information they need to know before their trip. Focus on practical details they can act on immediately.",
    
    "If there are any time-sensitive items or specific requirements, highlight these early in the conversation. Make sure they understand what's required from their side.",
    
    "Address any special conditions or limitations proactively. It's better to set clear expectations now than deal with confusion later.",
    
    "Provide contact information for ongoing support. Make sure they know how to reach you or the support team if questions come up later.",
    
    "End by asking if they have any questions and confirming they feel prepared. Close with a warm send-off that reflects your company's values."
  ];
}

function generateChatSummary(chatMessages: Array<{ sender: string; content: string; timestamp?: string }>): ChatSummary {
  // Mock chat summary generation
  // In production, this would use AI to analyze chat history
  
  const startTime = Date.now();
  
  const trip_overview = chatMessages.length > 0
    ? "Dubai family trip (5 days, 4 nights). All vouchers verified and active. Customer confirmation call scheduled. Shared transfers assigned, no upgrade requested yet."
    : "No prior team discussion available. Standard voucher confirmation required.";
  
  const known_preferences = chatMessages.length > 0
    ? [
        "Family traveling with children - ensure child-friendly activities are highlighted",
        "Vegetarian food preferences mentioned for desert safari",
        "Interested in cultural experiences (BAPS Mandir, traditional souks)"
      ]
    : [
        "No specific preferences documented yet",
        "Confirm dietary requirements during call"
      ];
  
  const concerns_raised = chatMessages.length > 0
    ? [
        "Tourism Dirham Fee payment process unclear to customer",
        "BAPS Mandir advance registration requirement - customer may not be aware",
        "Shared transfer timing concerns - emphasize 5-minute waiting policy"
      ]
    : [
        "Verify all concerns during the call",
        "Document any special requests in CRM"
      ];
  
  const processingTime = (Date.now() - startTime) / 1000;
  
  return {
    trip_overview,
    known_preferences,
    concerns_raised,
    processing_time_seconds: parseFloat(processingTime.toFixed(2)),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
}
