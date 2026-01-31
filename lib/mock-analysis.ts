import type { CallAnalysis } from "./types";

export const mockCallAnalysis: CallAnalysis = {
  conveyed_items: [
    {
      category: "Documents",
      item: "Passport requirements",
      quote: "Please carry your passport original and a copy"
    },
    {
      category: "Documents",
      item: "Flight tickets",
      quote: "Printed copies of flight tickets required"
    },
    {
      category: "Documents",
      item: "Hotel vouchers",
      quote: "Keep printed hotel vouchers handy"
    },
    {
      category: "Flight",
      item: "Baggage allowance",
      quote: "30 kg checked, 7 kg cabin baggage per person"
    },
    {
      category: "Hotel",
      item: "Check-in/out times",
      quote: "Check-in 2 PM, checkout 12 PM"
    },
    {
      category: "Activities",
      item: "Driver contact timing",
      quote: "Driver numbers shared 1 hour before pickup"
    },
    {
      category: "Activities",
      item: "BAPS Mandir registration",
      quote: "Register online 1 day prior, closed on Mondays"
    },
    {
      category: "Support",
      item: "24/7 chat support",
      quote: "Live chat active 3 days before trip"
    }
  ],
  missed_items: [
    {
      category: "Hotel",
      item: "Tourism Dirham Fee",
      importance: "High",
      recommendation: "Customer should know about AED 7-20 additional cost at hotel"
    },
    {
      category: "Activities",
      item: "Transfer waiting times",
      importance: "Medium",
      recommendation: "Mention 5 min for shared, 10 min for private transfers"
    },
    {
      category: "Activities",
      item: "Desert Safari dietary restrictions",
      importance: "Medium",
      recommendation: "Inform about limited vegetarian options"
    },
    {
      category: "Flight",
      item: "Web check-in process",
      importance: "Low",
      recommendation: "Remind to do web check-in for seat selection"
    }
  ],
  tasks: [
    {
      task: "Complete web check-in",
      owner: "Customer",
      deadline: "Before flight",
      context: "For seat and meal selection"
    },
    {
      task: "Register at BAPS Mandir portal",
      owner: "Customer",
      deadline: "1 day before visit",
      context: "Visit pass required with passport"
    },
    {
      task: "Download Pickyourtrail app",
      owner: "Customer",
      deadline: "Before departure",
      context: "For vouchers and support access"
    },
    {
      task: "Follow-up on Tourism Fee",
      owner: "Agent",
      deadline: "Today",
      context: "Send clarification email about hotel charges"
    }
  ],
  insights: {
    call_quality: "Good",
    customer_sentiment: "Positive",
    salesperson_performance: "Covered most key points professionally",
    areas_of_concern: [
      "Missed Tourism Dirham Fee explanation",
      "Transfer waiting times not mentioned",
      "Limited coverage of dietary options"
    ],
    positive_highlights: [
      "Clear explanation of documents required",
      "Excellent coverage of activity timings",
      "Professional and friendly tone throughout",
      "Good handling of BAPS Mandir registration details"
    ],
    overall_summary: "Overall good call with strong customer engagement. Agent covered 80% of mandatory points with clear communication. Main improvement area: ensure all fee-related information is conveyed to avoid surprises."
  },
  compliance_score: {
    total_mandatory_items: 25,
    items_conveyed: 20,
    items_missed: 5,
    percentage: 80.0,
    rating: "Mostly Compliant"
  },
  processing_time_seconds: 3.45,
  timestamp: "2026-01-30 12:00:00"
};
