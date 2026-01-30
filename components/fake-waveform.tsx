"use client";

import { useEffect, useState } from "react";

interface FakeWaveformProps {
  isActive?: boolean;
}

export function FakeWaveform({ isActive = true }: FakeWaveformProps) {
  const [bars, setBars] = useState<number[]>([]);
  const barCount = 60;

  useEffect(() => {
    if (!isActive) return;

    // Initialize bars with random heights
    setBars(Array.from({ length: barCount }, () => Math.random() * 60 + 20));

    // Animate bars continuously
    const interval = setInterval(() => {
      setBars(prev => {
        const newBars = [...prev];
        // Update 5-10 random bars each frame for realistic variation
        const barsToUpdate = Math.floor(Math.random() * 5) + 5;
        for (let i = 0; i < barsToUpdate; i++) {
          const index = Math.floor(Math.random() * barCount);
          // Simulate voice patterns - occasional spikes
          const isSpiking = Math.random() > 0.7;
          if (isSpiking) {
            newBars[index] = Math.random() * 40 + 40; // Tall bars (40-80%)
          } else {
            newBars[index] = Math.random() * 30 + 10; // Regular bars (10-40%)
          }
        }
        return newBars;
      });
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="relative w-full">
      <div className="flex h-16 items-center justify-center gap-0.5 overflow-hidden rounded-lg bg-green-50/50 px-2 dark:bg-green-950/30">
        {bars.map((height, index) => (
          <div
            key={index}
            className="w-1 rounded-full bg-green-500 transition-all duration-100 ease-out"
            style={{
              height: `${height}%`,
              minHeight: "4px",
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="text-xs text-muted-foreground">Live Audio</span>
      </div>
    </div>
  );
}
