/**
 * Type definitions for call analysis
 */

export interface ConveyedItem {
  category: string;
  item: string;
  quote: string;
}

export interface MissedItem {
  category: string;
  item: string;
  importance: "High" | "Medium" | "Low";
  recommendation: string;
}

export interface Task {
  task: string;
  owner: string;
  deadline: string;
  context: string;
}

export interface CallInsights {
  call_quality: string;
  customer_sentiment: string;
  salesperson_performance: string;
  areas_of_concern: string[];
  positive_highlights: string[];
  overall_summary: string;
}

export interface ComplianceScore {
  total_mandatory_items: number;
  items_conveyed: number;
  percentage: number;
  rating: string;
}

export interface CallAnalysis {
  conveyed_items: ConveyedItem[];
  missed_items: MissedItem[];
  tasks: Task[];
  insights: CallInsights;
  compliance_score: ComplianceScore;
  processing_time_seconds: number;
  timestamp: string;
}

// Briefing Call Types
export interface BriefingCall {
  id: string;
  bookingId: string;
  customerName: string;
  airport: string;
  status: "Todo" | "In Progress" | "Done" | "Won" | "Booked";
  dateCreated: string;
  callDate: string;
  followUpDate: string;
  notes?: string;
}
