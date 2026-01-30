"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Phone, Search } from "lucide-react";
import { mockBriefingCalls } from "@/lib/mock-calls";
import { useRouter } from "next/navigation";
import type { BriefingCall } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCalls = mockBriefingCalls.filter((call) =>
    call.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.bookingId.includes(searchQuery) ||
    call.airport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: BriefingCall["status"]) => {
    switch (status) {
      case "Todo":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Done":
        return "bg-green-100 text-green-700 border-green-300";
      case "Won":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Booked":
        return "bg-orange-100 text-orange-700 border-orange-300";
    }
  };

  const handleCallClick = (callId: string) => {
    router.push(`/call-in-progress?callId=${callId}`);
  };

  const isCallDatePassed = (callDate: string) => {
    const today = new Date("2026-01-30");
    const targetDate = new Date(callDate);
    return targetDate < today;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">
            Briefing Call Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage and track customer briefing calls
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-850">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, booking ID, or airport..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Calls Table */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-850">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Booking ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Airport
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Call Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Follow Up
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredCalls.map((call) => (
                  <tr
                    key={call.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {call.customerName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="cursor-pointer font-mono text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                        {call.bookingId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {call.airport}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`border text-xs ${getStatusColor(call.status)}`}
                      >
                        {call.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm ${
                          isCallDatePassed(call.callDate)
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {call.callDate}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {call.followUpDate}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleCallClick(call.id)}
                        className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Call
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCalls.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No calls found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-slate-500">Total</div>
            <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{mockBriefingCalls.length}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-slate-500">Completed</div>
            <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              {mockBriefingCalls.filter((c) => c.status === "Done" || c.status === "Won").length}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-slate-500">Pending</div>
            <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              {mockBriefingCalls.filter((c) => c.status === "Todo").length}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-slate-500">In Progress</div>
            <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              {mockBriefingCalls.filter((c) => c.status === "In Progress").length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
