"use client";

import { useEffect, useState } from "react";
import { Phone, PhoneOff } from "lucide-react";

interface CallAnimationProps {
  onComplete: () => void;
}

export function CallAnimation({ onComplete }: CallAnimationProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [status, setStatus] = useState<"connecting" | "active" | "ending">("connecting");

  useEffect(() => {
    // Connecting phase (1 second)
    const connectTimer = setTimeout(() => {
      setStatus("active");
    }, 1000);

    // Active call duration counter
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Auto end call after 4 seconds
    const endTimer = setTimeout(() => {
      setStatus("ending");
      setTimeout(() => {
        onComplete();
      }, 1000);
    }, 4000);

    return () => {
      clearTimeout(connectTimer);
      clearTimeout(endTimer);
      clearInterval(interval);
    };
  }, [onComplete]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex items-center justify-center py-8">
      <div className="relative">
        {/* Pulsing rings */}
        {status === "active" && (
          <>
            <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
          </>
        )}
        
        {/* Main card */}
        <div className="relative rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900" style={{ width: "400px" }}>
          {/* Status indicator */}
          <div className="mb-6 flex items-center justify-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-full ${
              status === "ending" ? "bg-red-100" : "bg-green-100"
            }`}>
              {status === "ending" ? (
                <PhoneOff className="h-12 w-12 text-red-600" />
              ) : (
                <Phone className={`h-12 w-12 text-green-600 ${status === "connecting" ? "animate-pulse" : ""}`} />
              )}
            </div>
          </div>

          {/* Status text */}
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold">
              {status === "connecting" && "Connecting..."}
              {status === "active" && "Call in Progress"}
              {status === "ending" && "Call Ending"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {status === "connecting" && "Establishing connection with customer"}
              {status === "active" && "Customer: Travel Booking"}
              {status === "ending" && "Analyzing call data"}
            </p>
          </div>

          {/* Call duration */}
          {status === "active" && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 dark:bg-green-950">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-lg font-mono font-semibold text-green-700 dark:text-green-300">
                  {formatDuration(callDuration)}
                </span>
              </div>
            </div>
          )}

          {/* Call stages indicator */}
          <div className="space-y-2">
            <div className={`flex items-center gap-3 rounded-lg p-3 ${
              status === "connecting" || status === "active" || status === "ending" 
                ? "bg-green-50 dark:bg-green-950" 
                : "bg-gray-50 dark:bg-gray-800"
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                status === "connecting" || status === "active" || status === "ending"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`} />
              <span className="text-sm">Connection established</span>
            </div>
            
            <div className={`flex items-center gap-3 rounded-lg p-3 ${
              status === "active" || status === "ending"
                ? "bg-green-50 dark:bg-green-950" 
                : "bg-gray-50 dark:bg-gray-800"
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                status === "active" || status === "ending"
                  ? "bg-green-500 animate-pulse"
                  : "bg-gray-300"
              }`} />
              <span className="text-sm">Call active - Following script</span>
            </div>
            
            <div className={`flex items-center gap-3 rounded-lg p-3 ${
              status === "ending"
                ? "bg-blue-50 dark:bg-blue-950" 
                : "bg-gray-50 dark:bg-gray-800"
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                status === "ending"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-gray-300"
              }`} />
              <span className="text-sm">Processing analysis...</span>
            </div>
          </div>

          {/* Progress bar */}
          {status !== "ending" && (
            <div className="mt-6">
              <div className="h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  className="h-full bg-green-500 transition-all duration-1000"
                  style={{ width: `${(callDuration / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
